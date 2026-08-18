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
import { authRedirect } from "@/lib/authRedirects";

type AuthMode = "login" | "register" | "reset" | "update";

type AccountUser = { id: string; email?: string | null };

export default function Account() {
  const { language, toggleLanguage, t } = useLanguage();
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
        setMessage(t("inline_d63177af7c"));
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirect("/account?reset=1") });
        if (error) throw error;
        setMessage(t("inline_0ba0e93087"));
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: authRedirect("/account") } });
        if (error) throw error;
        setPassword("");
        if (data.session) setLocation("/profile");
        else setMessage(t("inline_cd501efffe"));
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
      setMessage(t("inline_f447dfac7c"));
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
      setMessage(t("inline_0743a7af63"));
    } catch {
      setMessage(t("inline_b30d3e2293"));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setMessage(t("inline_018715048c"));
  }

  const title = mode === "update" ? (t("inline_c1ad68e0b8")) : mode === "reset" ? (t("inline_82c88aba3b")) : mode === "register" ? (t("inline_5127a55413")) : (t("inline_2e1c924611"));
  const formMode = mode === "update" ? "update" : mode;

  return (
    <main className="page-shell account-shell min-h-screen overflow-x-hidden bg-[#f7f0df] px-4 py-5 text-[#173e37] sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl justify-between gap-4 pb-5 sm:pb-8">
        <a href="/" className="self-center text-xs font-extrabold uppercase tracking-[.14em] text-[#987019]">← {t("inline_1632735855")}</a>
        <button type="button" onClick={toggleLanguage} className="rounded-md border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] transition-colors hover:border-[#a87416]" aria-label={t("inline_e0aa42db72")}>{t("inline_43d5c6585d")}</button>
      </div>

      <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-7">
        <Card className="min-w-0 rounded-2xl border-[#cbbd99] bg-[#fffaf0] shadow-sm">
          <CardHeader className="p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">{t("inline_13e5fcac24")}</p>
            <CardTitle className="display-font max-w-[12ch] text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">{t("inline_d838a92257")}</CardTitle>
            <CardDescription className="max-w-md text-sm leading-7 text-[#625d50]">{t("inline_920ea74f48")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-7 text-sm font-semibold text-[#4d5a51] sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
            <div className="flex items-center gap-3"><ShieldCheck size={17} className="text-[#a87416]" />{t("inline_9b4a50e8e8")}</div>
            <div className="flex items-center gap-3"><KeyRound size={17} className="text-[#a87416]" />{t("inline_a5946545d1")}</div>
            <div className="flex items-center gap-3"><Fingerprint size={17} className="text-[#a87416]" />{t("inline_36a0eb1e5c")}</div>
          </CardContent>
        </Card>

        <Card className="account-form-panel min-w-0 rounded-2xl border-[#496d61] bg-[#173e37] text-[#fffaf0] shadow-sm" style={{ backgroundColor: "var(--coc-account-panel)" }}>
          {user && mode !== "update" ? (
            <>
              <CardHeader className="p-6 sm:p-8 lg:p-10">
                <p className="eyebrow !text-[#e6b95e]">{t("inline_db669b2e9c")}</p>
                <CardTitle className="mt-2 break-words text-2xl sm:text-3xl">{user.email}</CardTitle>
                <CardDescription className="text-[#d2d8ca]">{t("inline_3c2b02d3c7")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-6 pb-7 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
                <Button disabled={busy} onClick={registerPasskey} className="w-full justify-center rounded-lg bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><Fingerprint size={16} />{t("inline_0b5b5c0df0")}</Button>
                <Button variant="outline" onClick={logout} className="w-full justify-center rounded-lg border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><LogOut size={16} />{t("inline_341c16400c")}</Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="p-6 pb-3 sm:p-8 sm:pb-3 lg:p-10 lg:pb-3">
                <CardTitle className="display-font text-3xl sm:text-4xl">{mode === "update" ? (t("inline_6ab5edbd9f")) : t("inline_caedc3922b")}</CardTitle>
                <CardDescription className="text-[#d2d8ca]">{mode === "update" ? (t("inline_e4e1f2a7cd")) : t("inline_48bd88e0b1")}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-7 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10">
                {mode === "update" ? (
                  <AuthForm mode={formMode} busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} t={t} />
                ) : (
                  <Tabs value={mode} onValueChange={(value) => { setMode(value as AuthMode); setMessage(""); }} className="w-full">
                    <TabsList className="grid h-auto w-full grid-cols-3 rounded-lg bg-[#21473e] p-1">
                      <TabsTrigger value="login" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><LogIn size={14} />{t("inline_53bb00098b")}</TabsTrigger>
                      <TabsTrigger value="register" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><UserPlus size={14} />{t("inline_1ca44a51c6")}</TabsTrigger>
                      <TabsTrigger value="reset" className="min-w-0 px-2 py-2 text-[.65rem] text-[#d2d8ca] data-[state=active]:bg-[#fffaf0] data-[state=active]:text-[#173e37] sm:text-xs"><LinkIcon size={14} />{t("inline_9781b15036")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="mt-6"><AuthForm mode="login" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} t={t} /><Separator className="my-6 bg-[#496d61]" /><Button disabled={busy} variant="outline" onClick={passkeyLogin} className="w-full justify-center rounded-lg border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#284d43]"><Fingerprint size={16} />{t("inline_4d46f412b0")}</Button></TabsContent>
                    <TabsContent value="register" className="mt-6"><AuthForm mode="register" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} t={t} /></TabsContent>
                    <TabsContent value="reset" className="mt-6"><AuthForm mode="reset" busy={busy} email={email} password={password} setEmail={setEmail} setPassword={setPassword} submit={submit} title={title} fr={fr} message={message} t={t} /></TabsContent>
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
  t: (key: string) => string;
};

function AuthForm({ mode, busy, email, password, setEmail, setPassword, submit, title, fr, message, t }: AuthFormProps) {
  const requiresEmail = mode !== "update";
  const requiresPassword = mode !== "reset";
  return (
    <form onSubmit={submit} className="grid gap-4">
      {requiresEmail && <div className="grid gap-2"><Label htmlFor="account-email" className="text-[#d2d8ca]">Email</Label><Input id="account-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="h-11 border-[#66857c] bg-[#21473e] text-[#fffaf0] placeholder:text-[#9cb4a9] focus-visible:ring-[#d69024]" /></div>}
      {requiresPassword && <div className="grid gap-2"><Label htmlFor="account-password" className="text-[#d2d8ca]">{mode === "update" ? (t("inline_6ab5edbd9f")) : t("inline_c3474d4ee1")}</Label><Input id="account-password" required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "update" ? "new-password" : mode === "register" ? "new-password" : "current-password"} className="h-11 border-[#66857c] bg-[#21473e] text-[#fffaf0] placeholder:text-[#9cb4a9] focus-visible:ring-[#d69024]" /></div>}
      <Button disabled={busy} type="submit" aria-busy={busy} className="mt-2 h-11 w-full justify-center rounded-lg bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]">{busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("inline_a67528c167")}</> : title}</Button>
      {message && <p role="status" className="text-sm leading-6 text-[#e7ba61]">{message}</p>}
    </form>
  );
}
