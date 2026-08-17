import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Fingerprint, KeyRound, Link as LinkIcon, Loader2, LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/authErrors";

type AuthMode = "login" | "register" | "reset" | "update";

type AccountUser = { id: string; email?: string | null };

export default function Account() {
  const { language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const fr = language === "fr";
  const [user, setUser] = useState<AccountUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const isRecovery = new URLSearchParams(window.location.search).get("reset") === "1";
    if (isRecovery) setMode("update");

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user && !isRecovery) {
        setLocation("/profile");
        return;
      }
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      if (event === "SIGNED_IN") setLocation("/profile");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [setLocation]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "update") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setMode("login");
        setMessage(fr ? "Mot de passe mis à jour." : "Password updated.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account?reset=1` });
        if (error) throw error;
        setMessage(fr ? "Si cette adresse existe, un lien de récupération vient d’être envoyé." : "If this address exists, a recovery link has been sent.");
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setPassword("");
        if (data.session) setLocation("/profile");
        else setMessage(fr ? "Compte créé. Consultez votre email pour confirmer l’adresse." : "Account created. Check your email to confirm the address.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setPassword("");
        setLocation("/profile");
      }
    } catch (error) {
      setMessage(friendlyAuthError(error, fr));
    } finally {
      setBusy(false);
    }
  }

  async function passkeyLogin() {
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithPasskey();
      if (error) throw error;
      setLocation("/profile");
    } catch {
      setMessage(fr ? "Passkey annulée, désactivée ou indisponible." : "Passkey cancelled, disabled, or unavailable.");
    } finally {
      setBusy(false);
    }
  }

  async function registerPasskey() {
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.registerPasskey();
      if (error) throw error;
      setMessage(fr ? "Passkey ajoutée à votre compte." : "Passkey added to your account.");
    } catch {
      setMessage(fr ? "Impossible d’ajouter cette Passkey." : "Unable to add this Passkey.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setMessage(fr ? "Session fermée." : "Signed out.");
  }

  const title = mode === "update" ? (fr ? "Enregistrer le nouveau mot de passe" : "Save new password") : mode === "reset" ? (fr ? "Récupérer votre compte" : "Recover your account") : mode === "register" ? (fr ? "Créer mon compte" : "Create my account") : (fr ? "Se connecter" : "Sign in");
  const formMode = mode === "update" ? "update" : mode;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f0df] px-4 py-5 text-[#173e37] sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl justify-between gap-4 pb-5 sm:pb-8">
        <a href="/" className="self-center text-xs font-extrabold uppercase tracking-[.14em] text-[#987019]">← {fr ? "Accueil" : "Home"}</a>
        <button type="button" onClick={toggleLanguage} className="rounded-md border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] transition-colors hover:border-[#a87416]" aria-label={fr ? "Passer en anglais" : "Switch to French"}>{fr ? "EN" : "FR"}</button>
      </div>

      <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-7">
        <Card className="min-w-0 rounded-2xl border-[#cbbd99] bg-[#fffaf0] shadow-sm">
          <CardHeader className="p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">{fr ? "Votre espace" : "Your space"}</p>
            <CardTitle className="display-font max-w-[12ch] text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">{fr ? "Apprendre, puis retrouver son chemin." : "Learn, then find your way back."}</CardTitle>
            <CardDescription className="max-w-md text-sm leading-7 text-[#625d50]">{fr ? "Un compte simple pour sauvegarder vos leçons et retrouver votre progression sur tous vos appareils." : "A simple account to save your lessons and resume progress across devices."}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-7 text-sm font-semibold text-[#4d5a51] sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
            <div className="flex items-center gap-3"><ShieldCheck size={17} className="text-[#a87416]" />{fr ? "Session sécurisée" : "Secure session"}</div>
            <div className="flex items-center gap-3"><KeyRound size={17} className="text-[#a87416]" />{fr ? "Récupération de compte" : "Account recovery"}</div>
            <div className="flex items-center gap-3"><Fingerprint size={17} className="text-[#a87416]" />{fr ? "Connexion rapide" : "Fast sign-in"}</div>
          </CardContent>
        </Card>

        <Card className="min-w-0 rounded-2xl border-[#496d61] bg-[#173e37] text-[#fffaf0] shadow-sm">
          {user && mode !== "update" ? (
            <>
              <CardHeader className="p-6 sm:p-8 lg:p-10">
                <p className="eyebrow !text-[#e6b95e]">{fr ? "Session active" : "Active session"}</p>
                <CardTitle className="mt-2 break-words text-2xl sm:text-3xl">{user.email}</CardTitle>
                <CardDescription className="text-[#d2d8ca]">{fr ? "Redirection vers votre profil…" : "Redirecting to your profile…"}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-6 pb-7 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
                <Button disabled={busy} onClick={registerPasskey} className="w-full justify-center rounded-lg bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><Fingerprint size={16} />{fr ? "Ajouter une Passkey" : "Add a Passkey"}</Button>
                <Button variant="outline" onClick={logout} className="w-full justify-center rounded-lg border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><LogOut size={16} />{fr ? "Se déconnecter" : "Sign out"}</Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="p-6 pb-3 sm:p-8 sm:pb-3 lg:p-10 lg:pb-3">
                <CardTitle className="display-font text-3xl sm:text-4xl">{mode === "update" ? (fr ? "Nouveau mot de passe" : "New password") : fr ? "Votre compte" : "Your account"}</CardTitle>
                <CardDescription className="text-[#d2d8ca]">{mode === "update" ? (fr ? "Choisissez un nouveau mot de passe sécurisé." : "Choose a new secure password.") : fr ? "Connectez-vous pour reprendre votre progression." : "Sign in to resume your progress."}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-7 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
                {mode === "update" ? (
                  <AuthForm mode={formMode} busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} />
                ) : (
                  <Tabs value={mode} onValueChange={(value) => { setMode(value as AuthMode); setMessage(""); }} className="w-full">
                    <TabsList className="grid h-auto w-full grid-cols-3 rounded-lg bg-[#21473e] p-1">
                      <TabsTrigger value="login" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><LogIn size={14} />{fr ? "Connexion" : "Sign in"}</TabsTrigger>
                      <TabsTrigger value="register" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><UserPlus size={14} />{fr ? "Créer" : "Create"}</TabsTrigger>
                      <TabsTrigger value="reset" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><LinkIcon size={14} />{fr ? "Récupérer" : "Recover"}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="mt-6"><AuthForm mode="login" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} /><Separator className="my-6 bg-[#496d61]" /><Button disabled={busy} variant="outline" onClick={passkeyLogin} className="w-full justify-center rounded-lg border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><Fingerprint size={16} />{fr ? "Se connecter avec une Passkey" : "Sign in with a Passkey"}</Button></TabsContent>
                    <TabsContent value="register" className="mt-6"><AuthForm mode="register" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} /></TabsContent>
                    <TabsContent value="reset" className="mt-6"><AuthForm mode="reset" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} /></TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}

type AuthFormProps = {
  mode: AuthMode;
  busy: boolean;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: React.FormEvent) => void;
  title: string;
  fr: boolean;
  message: string;
};

function AuthForm({ mode, busy, email, password, setEmail, setPassword, submit, title, fr, message }: AuthFormProps) {
  const requiresEmail = mode !== "update";
  const requiresPassword = mode !== "reset";
  return (
    <form onSubmit={submit} className="grid gap-4">
      {requiresEmail && <div className="grid gap-2"><Label htmlFor="account-email" className="text-[#d2d8ca]">Email</Label><Input id="account-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="h-11 border-[#66857c] bg-[#21473e] text-[#fffaf0] placeholder:text-[#9cb4a9] focus-visible:ring-[#d69024]" /></div>}
      {requiresPassword && <div className="grid gap-2"><Label htmlFor="account-password" className="text-[#d2d8ca]">{mode === "update" ? (fr ? "Nouveau mot de passe" : "New password") : fr ? "Mot de passe" : "Password"}</Label><Input id="account-password" required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "update" ? "new-password" : mode === "register" ? "new-password" : "current-password"} className="h-11 border-[#66857c] bg-[#21473e] text-[#fffaf0] placeholder:text-[#9cb4a9] focus-visible:ring-[#d69024]" /></div>}
      <Button disabled={busy} type="submit" aria-busy={busy} className="mt-2 h-11 w-full justify-center rounded-lg bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]">{busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{fr ? "Traitement…" : "Working…"}</> : title}</Button>
      {message && <p role="status" className="text-sm leading-6 text-[#e7ba61]">{message}</p>}
    </form>
  );
}
