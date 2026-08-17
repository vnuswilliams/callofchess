import crypto from "node:crypto";
import mysql from "mysql2/promise";

const SESSION_COOKIE = "lc_session";
const SESSION_DAYS = 30;
function readSessionToken(header: string | undefined) {
  const entry = (header ?? "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : undefined;
}
function sessionCookie(value: string, maxAge: number) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

let pool: mysql.Pool | undefined;
function getPool() {
  if (!pool) pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4, waitForConnections: true });
  return pool;
}

export function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function validPassword(value: unknown) {
  return typeof value === "string" && value.length >= 8 && value.length <= 200;
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await new Promise<Buffer>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [salt, expectedHex] = encoded.split(":");
  if (!salt || !expectedHex) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function createSession(userId: number, res: any) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);
  await getPool().execute("INSERT INTO app_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [tokenHash, userId, expires]);
  res.setHeader("Set-Cookie", sessionCookie(token, SESSION_DAYS * 86400));
}

export async function destroySession(req: any, res: any) {
  const token = readSessionToken(req.headers.cookie);
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await getPool().execute("DELETE FROM app_sessions WHERE token_hash = ?", [tokenHash]);
  }
  res.setHeader("Set-Cookie", sessionCookie("", 0));
}

export async function getSessionUser(req: any) {
  const token = readSessionToken(req.headers.cookie);
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT u.id, u.email FROM app_sessions s JOIN app_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() LIMIT 1", [tokenHash]);
  return rows[0] ?? null;
}

export async function saveProgress(userId: number, lessonId: string, completedStep: number, completed: boolean) {
  await getPool().execute("INSERT INTO app_lesson_progress (user_id, lesson_id, completed_step, completed_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed_step = GREATEST(completed_step, VALUES(completed_step)), completed_at = IF(VALUES(completed_at) IS NULL, completed_at, VALUES(completed_at))", [userId, lessonId, completedStep, completed ? new Date() : null]);
}

export async function readProgress(userId: number) {
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>("SELECT lesson_id AS lessonId, completed_step AS completedStep, completed_at AS completedAt, updated_at AS updatedAt FROM app_lesson_progress WHERE user_id = ? ORDER BY lesson_id", [userId]);
  return rows;
}
