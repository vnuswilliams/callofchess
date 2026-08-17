import { useEffect, useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type User = { id: number; email: string };

async function api(path: string, options?: RequestInit) {
  const response = await fetch(`/api/${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) }, credentials: "include" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export default function Account() {
  const { language } = useLanguage();
  const fr = language === "fr";
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { api("auth/me").then((data) => setUser(data.user)).catch(() => undefined); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const data = await api(`auth/${mode}`, { method: "POST", body: JSON.stringify({ email, password }) });
      setUser(data.user); setPassword(""); setMessage(fr ? "Votre session est ouverte." : "Your session is active.");
    } catch (error) { setMessage(error instanceof Error ? error.message : (fr ? "Connexion impossible." : "Unable to sign in.")); }
    finally { setBusy(false); }
  }

  async function passkeyLogin() {
    setBusy(true); setMessage("");
    try {
      const options = await api("passkey/login/options", { method: "POST" });
      const response = await startAuthentication({ optionsJSON: options });
      const data = await api("passkey/login/verify", { method: "POST", body: JSON.stringify({ expectedChallenge: options.challenge, response }) });
      setUser(data.user); setMessage(fr ? "Connexion Passkey réussie." : "Passkey sign-in succeeded.");
    } catch { setMessage(fr ? "Passkey annulée ou indisponible sur cet appareil." : "Passkey cancelled or unavailable on this device."); }
    finally { setBusy(false); }
  }

  async function registerPasskey() {
    setBusy(true); setMessage("");
    try {
      const options = await api("passkey/register/options", { method: "POST" });
      const response = await startRegistration({ optionsJSON: options });
      await api("passkey/register/verify", { method: "POST", body: JSON.stringify({ expectedChallenge: options.challenge, response }) });
      setMessage(fr ? "Passkey ajoutée à votre compte." : "Passkey added to your account.");
    } catch { setMessage(fr ? "Impossible d’ajouter cette Passkey." : "Unable to add this Passkey."); }
    finally { setBusy(false); }
  }

  async function logout() { await api("auth/logout", { method: "POST" }); setUser(null); }

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-16 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.9fr_1.1fr]"><section className="border border-[#cbbd99] bg-[#fffaf0] p-7 sm:p-10"><a href="/" className="text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]">← {fr ? "Retour" : "Back"}</a><p className="eyebrow mt-16">{fr ? "Votre espace" : "Your space"}</p><h1 className="display-font mt-4 text-6xl leading-[.9]">{fr ? "Apprendre, puis retrouver son chemin." : "Learn, then find your way back."}</h1><p className="mt-6 max-w-md leading-7 text-[#625d50]">{fr ? "Un compte simple pour sauvegarder vos leçons et retrouver votre progression sur vos appareils." : "A simple account to save your lessons and resume your progress across devices."}</p><div className="mt-10 space-y-3 text-sm font-semibold text-[#4d5a51]"><p className="flex items-center gap-3"><ShieldCheck size={17} className="text-[#a87416]" />{fr ? "Session protégée par cookie httpOnly" : "Session protected with an httpOnly cookie"}</p><p className="flex items-center gap-3"><Fingerprint size={17} className="text-[#a87416]" />{fr ? "Passkey disponible après connexion" : "Passkey available after sign-in"}</p></div></section><section className="border border-[#496d61] bg-[#173e37] p-7 text-[#fffaf0] sm:p-10">{user ? <><p className="eyebrow !text-[#e6b95e]">{fr ? "Session active" : "Active session"}</p><h2 className="display-font mt-4 text-4xl">{user.email}</h2><p className="mt-4 text-sm leading-6 text-[#d2d8ca]">{fr ? "Votre progression peut maintenant être sauvegardée dans votre compte." : "Your progress can now be saved to your account."}</p><div className="mt-8 grid gap-3"><Button disabled={busy} onClick={registerPasskey} className="justify-center rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><Fingerprint size={16} />{fr ? "Ajouter une Passkey" : "Add a Passkey"}</Button><Button variant="outline" onClick={logout} className="justify-center rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><LogOut size={16} />{fr ? "Se déconnecter" : "Sign out"}</Button></div></> : <><div className="flex gap-2"><button onClick={() => setMode("login")} className={`border-b-2 px-1 pb-3 text-[.68rem] font-extrabold uppercase tracking-[.14em] ${mode === "login" ? "border-[#d69024] text-[#fffaf0]" : "border-transparent text-[#a8bbb0]"}`}><LogIn size={15} className="mr-2 inline" />{fr ? "Connexion" : "Sign in"}</button><button onClick={() => setMode("register")} className={`border-b-2 px-1 pb-3 text-[.68rem] font-extrabold uppercase tracking-[.14em] ${mode === "register" ? "border-[#d69024] text-[#fffaf0]" : "border-transparent text-[#a8bbb0]"}`}><UserPlus size={15} className="mr-2 inline" />{fr ? "Créer un compte" : "Create account"}</button></div><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm"><span className="mb-2 block text-[#d2d8ca]">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-[#66857c] bg-[#21473e] px-4 py-3 text-[#fffaf0] outline-none focus:border-[#d69024]" /></label><label className="block text-sm"><span className="mb-2 block text-[#d2d8ca]">{fr ? "Mot de passe" : "Password"}</span><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#66857c] bg-[#21473e] px-4 py-3 text-[#fffaf0] outline-none focus:border-[#d69024]" /></label><Button disabled={busy} type="submit" className="w-full justify-center rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]">{mode === "login" ? (fr ? "Ouvrir la session" : "Sign in") : (fr ? "Créer mon compte" : "Create my account")}</Button></form><div className="my-6 flex items-center gap-3 text-[.65rem] uppercase tracking-[.12em] text-[#9cb4a9]"><span className="h-px flex-1 bg-[#496d61]" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-[#496d61]" /></div><Button disabled={busy} variant="outline" onClick={passkeyLogin} className="w-full justify-center rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><Fingerprint size={16} />{fr ? "Se connecter avec une Passkey" : "Sign in with a Passkey"}</Button></>}{message && <p role="status" className="mt-5 text-sm text-[#e7ba61]">{message}</p>}</section></div></main>;
}
