import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import crypto from "node:crypto";
import { createSession, destroySession, getSessionUser, hashPassword, normalizeEmail, readProgress, saveProgress, validPassword, verifyPassword } from "./_lib/auth.js";
import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;
function getPool() {
  if (!pool) pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4, waitForConnections: true });
  return pool;
}

function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8").json(body);
}

function rpContext(req: VercelRequest) {
  const host = String(req.headers.host ?? "localhost:3000").split(":")[0];
  const proto = String(req.headers["x-forwarded-proto"] ?? "http").split(",")[0];
  return { rpID: host, origin: `${proto}://${req.headers.host ?? host}` };
}

async function saveChallenge(challenge: string, userId: number | null, kind: "registration" | "authentication") {
  await getPool().execute("INSERT INTO app_webauthn_challenges (challenge, user_id, kind, expires_at) VALUES (?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 5 MINUTE))", [challenge, userId, kind]);
}

async function consumeChallenge(challenge: string, kind: "registration" | "authentication") {
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT challenge, user_id AS userId FROM app_webauthn_challenges WHERE challenge = ? AND kind = ? AND expires_at > UTC_TIMESTAMP() LIMIT 1", [challenge, kind]);
  if (!rows[0]) return null;
  await getPool().execute("DELETE FROM app_webauthn_challenges WHERE challenge = ?", [challenge]);
  return rows[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  const segments = Array.isArray(req.query.route) ? req.query.route : String(req.query.route ?? "").split("/").filter(Boolean);
  const route = segments.join("/");
  try {
    if (req.method === "POST" && route === "auth/register") {
      const email = normalizeEmail(req.body?.email);
      const password = req.body?.password;
      if (!email.includes("@") || !validPassword(password)) return json(res, 400, { error: "Adresse email ou mot de passe invalide." });
      const [existing] = await getPool().execute<mysql.RowDataPacket[]>("SELECT id FROM app_users WHERE email = ? LIMIT 1", [email]);
      if (existing.length) return json(res, 400, { error: "Impossible de créer le compte avec ces informations." });
      const [result] = await getPool().execute<mysql.ResultSetHeader>("INSERT INTO app_users (email, password_hash) VALUES (?, ?)", [email, await hashPassword(password)]);
      await createSession(result.insertId, res);
      return json(res, 201, { user: { id: result.insertId, email } });
    }

    if (req.method === "POST" && route === "auth/login") {
      const email = normalizeEmail(req.body?.email);
      const password = req.body?.password;
      const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT id, email, password_hash AS passwordHash FROM app_users WHERE email = ? LIMIT 1", [email]);
      const user = rows[0];
      if (!user?.passwordHash || !validPassword(password) || !(await verifyPassword(password, user.passwordHash))) return json(res, 401, { error: "Email ou mot de passe incorrect." });
      await createSession(user.id, res);
      return json(res, 200, { user: { id: user.id, email: user.email } });
    }

    if (req.method === "POST" && route === "passkey/register/options") {
      const user = await getSessionUser(req);
      if (!user) return json(res, 401, { error: "Connexion requise." });
      const { rpID } = rpContext(req);
      const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT credential_id AS id, transports FROM app_passkeys WHERE user_id = ?", [user.id]);
      const options = await generateRegistrationOptions({ rpName: "Échiquier", rpID, userName: user.email, userDisplayName: user.email, userID: new TextEncoder().encode(String(user.id)), excludeCredentials: rows.map((row) => ({ id: row.id, transports: row.transports ? row.transports.split(",") : undefined })) });
      await saveChallenge(options.challenge, user.id, "registration");
      return json(res, 200, options);
    }

    if (req.method === "POST" && route === "passkey/register/verify") {
      const user = await getSessionUser(req);
      if (!user) return json(res, 401, { error: "Connexion requise." });
      const { rpID, origin } = rpContext(req);
      const challenge = String(req.body?.response?.clientDataJSON ? "" : req.body?.challenge ?? "");
      const expectedChallenge = String(req.body?.expectedChallenge ?? "");
      const stored = await consumeChallenge(expectedChallenge || challenge, "registration");
      if (!stored) return json(res, 400, { error: "Le défi Passkey a expiré. Recommencez." });
      const verification = await verifyRegistrationResponse({ response: req.body.response, expectedChallenge: stored.challenge, expectedOrigin: origin, expectedRPID: rpID });
      if (!verification.verified || !verification.registrationInfo) return json(res, 400, { error: "La Passkey n’a pas pu être vérifiée." });
      const { credential } = verification.registrationInfo;
      await getPool().execute("INSERT INTO app_passkeys (user_id, credential_id, public_key, counter, transports) VALUES (?, ?, ?, ?, ?)", [user.id, Buffer.from(credential.id).toString("base64url"), Buffer.from(credential.publicKey).toString("base64"), credential.counter, Array.isArray(req.body.response?.transports) ? req.body.response.transports.join(",") : null]);
      return json(res, 201, { verified: true });
    }

    if (req.method === "POST" && route === "passkey/login/options") {
      const { rpID } = rpContext(req);
      const options = await generateAuthenticationOptions({ rpID, userVerification: "preferred" });
      await saveChallenge(options.challenge, null, "authentication");
      return json(res, 200, options);
    }

    if (req.method === "POST" && route === "passkey/login/verify") {
      const credentialId = String(req.body?.response?.id ?? "");
      const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT p.credential_id AS credentialId, p.public_key AS publicKey, p.counter, p.user_id AS userId, u.email FROM app_passkeys p JOIN app_users u ON u.id = p.user_id WHERE p.credential_id = ? LIMIT 1", [credentialId]);
      const storedCredential = rows[0];
      const expectedChallenge = String(req.body?.expectedChallenge ?? "");
      const storedChallenge = await consumeChallenge(expectedChallenge, "authentication");
      if (!storedCredential || !storedChallenge) return json(res, 400, { error: "La Passkey n’est pas reconnue ou le défi a expiré." });
      const { rpID, origin } = rpContext(req);
      const verification = await verifyAuthenticationResponse({ response: req.body.response, expectedChallenge: storedChallenge.challenge, expectedOrigin: origin, expectedRPID: rpID, credential: { id: storedCredential.credentialId, publicKey: Buffer.from(storedCredential.publicKey, "base64"), counter: Number(storedCredential.counter) } });
      if (!verification.verified) return json(res, 401, { error: "La vérification Passkey a échoué." });
      await getPool().execute("UPDATE app_passkeys SET counter = ? WHERE credential_id = ?", [verification.authenticationInfo.newCounter, credentialId]);
      await createSession(storedCredential.userId, res);
      return json(res, 200, { user: { id: storedCredential.userId, email: storedCredential.email } });
    }

    if (req.method === "POST" && route === "auth/logout") {
      await destroySession(req, res);
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && route === "auth/me") {
      const user = await getSessionUser(req);
      return json(res, 200, { user });
    }

    if (route === "progress") {
      const user = await getSessionUser(req);
      if (!user) return json(res, 401, { error: "Connexion requise." });
      if (req.method === "GET") return json(res, 200, { progress: await readProgress(user.id) });
      if (req.method === "PUT") {
        const lessonId = String(req.body?.lessonId ?? "").slice(0, 32);
        const completedStep = Math.max(0, Math.min(99, Number(req.body?.completedStep ?? 0)));
        if (!lessonId || !Number.isFinite(completedStep)) return json(res, 400, { error: "Progression invalide." });
        await saveProgress(user.id, lessonId, completedStep, Boolean(req.body?.completed));
        return json(res, 200, { ok: true });
      }
    }

    return json(res, 404, { error: "Route introuvable." });
  } catch (error) {
    console.error("auth-api-error", error);
    return json(res, 500, { error: "Une erreur serveur est survenue." });
  }
}
