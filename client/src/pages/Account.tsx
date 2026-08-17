import { useEffect, useState } from "react";
import { Fingerprint, KeyRound, Link as LinkIcon, Loader2, LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

export function genericAuthError(fr: boolean) {
  return fr ? "L’opération n’a pas pu aboutir. Vérifiez vos informations et réessayez." : "The operation could not be completed. Check your details and try again.";
}

export function friendlyAuthError(error: unknown, fr: boolean) {
  const text = error instanceof Error ? error.message.toLowerCase() : "";
  if (text.includes("already registered") || text.includes("already exists")) return fr ? "Cette adresse est déjà utilisée. Essayez de vous connecter." : "This email is already in use. Try signing in instead.";
  if (text.includes("invalid email") || text.includes("email")) return fr ? "Saisissez une adresse email valide." : "Enter a valid email address.";
  if (text.includes("password") && (text.includes("short") || text.includes("weak"))) return fr ? "Choisissez un mot de passe d’au moins 8 caractères." : "Choose a password with at least 8 characters.";
  if (text.includes("invalid login") || text.includes("invalid credentials")) return fr ? "Email ou mot de passe incorrect." : "Incorrect email or password.";
  return genericAuthError(fr);
}

export default function Account() {
  const { language, toggleLanguage } = useLanguage();
  const fr = language === "fr";
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register" | "reset" | "update">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (new URLSearchParams(window.location.search).get("reset") === "1") setMode("update");
    supabase.auth.getUser().then(({ data }) => { if (active) setUser(data.user ? { id: data.user.id, email: data.user.email } : null); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "update") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword(""); setMode("login");
        setMessage(fr ? "Mot de passe mis à jour. Vous pouvez vous reconnecter." : "Password updated. You can sign in again.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/compte?reset=1` });
        if (error) throw error;
        setMessage(fr ? "Si cette adresse existe, un lien de récupération vient d’être envoyé." : "If this address exists, a recovery link has been sent.");
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
        setPassword("");
        setMessage(data.session ? (fr ? "Compte créé et session ouverte." : "Account created and signed in.") : (fr ? "Compte créé. Consultez votre email pour confirmer l’adresse." : "Account created. Check your email to confirm the address."));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
        setPassword(""); setMessage(fr ? "Votre session est ouverte." : "Your session is active.");
      }
    } catch (error) { setMessage(friendlyAuthError(error, fr)); } finally { setBusy(false); }
  }

  async function passkeyLogin() {
    setBusy(true); setMessage("");
    try { const { error } = await supabase.auth.signInWithPasskey(); if (error) throw error; setMessage(fr ? "Connexion Passkey réussie." : "Passkey sign-in succeeded."); }
    catch { setMessage(fr ? "Passkey annulée, désactivée ou indisponible." : "Passkey cancelled, disabled, or unavailable."); }
    finally { setBusy(false); }
  }

  async function registerPasskey() {
    setBusy(true); setMessage("");
    try { const { error } = await supabase.auth.registerPasskey(); if (error) throw error; setMessage(fr ? "Passkey ajoutée à votre compte." : "Passkey added to your account."); }
    catch { setMessage(fr ? "Impossible d’ajouter cette Passkey. Activez-la dans Supabase Auth avant l’utilisation." : "Unable to add this Passkey. Enable it in Supabase Auth before use."); }
    finally { setBusy(false); }
  }

  async function logout() { await supabase.auth.signOut(); setUser(null); setMessage(fr ? "Session fermée." : "Signed out."); }

  const title = mode === "update" ? (fr ? "Enregistrer le nouveau mot de passe" : "Save new password") : mode === "reset" ? (fr ? "Récupérer votre compte" : "Recover your account") : mode === "register" ? (fr ? "Créer votre compte" : "Create your account") : (fr ? "Ouvrir votre session" : "Open your session");

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-16 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto mb-6 flex max-w-5xl justify-end"><button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] hover:border-[#a87416]" aria-label={fr ? "Passer en anglais" : "Switch to French"}>{fr ? "EN" : "FR"}</button></div><div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.9fr_1.1fr]"><section className="border border-[#cbbd99] bg-[#fffaf0] p-7 sm:p-10"><a href="/" className="text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]">← {fr ? "Retour" : "Back"}</a><p className="eyebrow mt-16">{fr ? "Votre espace" : "Your space"}</p><h1 className="display-font mt-4 text-6xl leading-[.9]">{fr ? "Apprendre, puis retrouver son chemin." : "Learn, then find your way back."}</h1><p className="mt-6 max-w-md leading-7 text-[#625d50]">{fr ? "Un compte simple pour sauvegarder vos leçons et retrouver votre progression sur vos appareils." : "A simple account to save your lessons and resume progress across devices."}</p><div className="mt-10 space-y-3 text-sm font-semibold text-[#4d5a51]"><p className="flex items-center gap-3"><ShieldCheck size={17} className="text-[#a87416]" />{fr ? "Session sécurisée" : "Secure session"}</p><p className="flex items-center gap-3"><KeyRound size={17} className="text-[#a87416]" />{fr ? "Récupération de compte" : "Account recovery"}</p><p className="flex items-center gap-3"><Fingerprint size={17} className="text-[#a87416]" />{fr ? "Connexion rapide et sécurisée" : "Fast and secure sign-in"}</p></div></section><section className="border border-[#496d61] bg-[#173e37] p-7 text-[#fffaf0] sm:p-10">{user && mode !== "update" ? <><p className="eyebrow !text-[#e6b95e]">{fr ? "Session active" : "Active session"}</p><h2 className="display-font mt-4 text-4xl">{user.email}</h2><p className="mt-4 text-sm leading-6 text-[#d2d8ca]">{fr ? "Votre progression peut maintenant être sauvegardée sur vos appareils." : "Your progress can now be saved across your devices."}</p><div className="mt-8 grid gap-3"><a href="/profil" className="flex items-center justify-center gap-2 rounded-none border border-[#66857c] px-4 py-2 text-sm font-semibold text-[#fffaf0] transition-colors hover:bg-[#284d43]">{fr ? "Voir mon profil" : "View my profile"}</a><Button disabled={busy} onClick={registerPasskey} className="justify-center rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><Fingerprint size={16} />{fr ? "Ajouter une Passkey" : "Add a Passkey"}</Button><Button variant="outline" onClick={logout} className="justify-center rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><LogOut size={16} />{fr ? "Se déconnecter" : "Sign out"}</Button></div></> : <><div className="flex flex-wrap gap-2">{mode !== "update" && <><button onClick={() => setMode("login")} className={`border-b-2 px-1 pb-3 text-[.68rem] font-extrabold uppercase tracking-[.14em] ${mode === "login" ? "border-[#d69024] text-[#fffaf0]" : "border-transparent text-[#a8bbb0]"}`}><LogIn size={15} className="mr-2 inline" />{fr ? "Connexion" : "Sign in"}</button><button onClick={() => setMode("register")} className={`border-b-2 px-1 pb-3 text-[.68rem] font-extrabold uppercase tracking-[.14em] ${mode === "register" ? "border-[#d69024] text-[#fffaf0]" : "border-transparent text-[#a8bbb0]"}`}><UserPlus size={15} className="mr-2 inline" />{fr ? "Créer un compte" : "Create account"}</button><button onClick={() => setMode("reset")} className={`border-b-2 px-1 pb-3 text-[.68rem] font-extrabold uppercase tracking-[.14em] ${mode === "reset" ? "border-[#d69024] text-[#fffaf0]" : "border-transparent text-[#a8bbb0]"}`}><LinkIcon size={15} className="mr-2 inline" />{fr ? "Récupérer" : "Recover"}</button></>}</div><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm"><span className="mb-2 block text-[#d2d8ca]">Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-[#66857c] bg-[#21473e] px-4 py-3 text-[#fffaf0] outline-none focus:border-[#d69024]" /></label>{mode !== "reset" && <label className="block text-sm"><span className="mb-2 block text-[#d2d8ca]">{fr ? "Mot de passe" : "Password"}</span><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#66857c] bg-[#21473e] px-4 py-3 text-[#fffaf0] outline-none focus:border-[#d69024]" /></label>}<Button disabled={busy} type="submit" aria-busy={busy} className="w-full justify-center rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]">{busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{fr ? "Traitement en cours…" : "Working…"}</> : title}</Button></form>{mode !== "reset" && <><div className="my-6 flex items-center gap-3 text-[.65rem] uppercase tracking-[.12em] text-[#9cb4a9]"><span className="h-px flex-1 bg-[#496d61]" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-[#496d61]" /></div><Button disabled={busy} variant="outline" onClick={passkeyLogin} className="w-full justify-center rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><Fingerprint size={16} />{fr ? "Se connecter avec une Passkey" : "Sign in with a Passkey"}</Button></>}{message && <p role="status" className="mt-5 text-sm text-[#e7ba61]">{message}</p>}</>}</section></div></main>;
}
