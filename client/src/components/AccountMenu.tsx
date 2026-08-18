import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, LogIn, LogOut, UserCircle, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type AccountMenuProps = {
  className?: string;
};

/** One compact account entry point for authenticated and anonymous users. */
export default function AccountMenu({ className = "" }: AccountMenuProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [hasUser, setHasUser] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setHasUser(Boolean(data.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setHasUser(Boolean(session?.user));
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    setBusy(true);
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(t("settings.signOutError"));
      setBusy(false);
      return;
    }
    setBusy(false);
    setLocation("/");
  }

  async function deleteAccount() {
    setBusy(true);
    setError("");
    const { error: deletionError } = await supabase.rpc("delete_current_user");
    if (deletionError) {
      setError(t("settings.deleteAccountError"));
      setBusy(false);
      return;
    }
    await supabase.auth.signOut();
    setBusy(false);
    setLocation("/");
  }

  if (!hasUser) {
    return <Link href="/account" className={`inline-flex items-center gap-2 text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416] ${className}`}><LogIn size={15} aria-hidden="true" />{t("account")}</Link>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={t("settings.accountMenu")} className={`inline-flex h-10 items-center gap-2 border border-[#b8aa86] px-3 text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:border-[#d69024] hover:bg-[#f5ecd7] ${className}`}>
          <UserCircle size={17} aria-hidden="true" />
          <span>{t("settings.accountMenu")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-[#cbbd99] bg-[#fffaf0] p-1 text-[#173e37]">
        <DropdownMenuLabel className="px-3 py-2 text-[.62rem] uppercase tracking-[.14em] text-[#756c58]">{t("settings.accountMenu")}</DropdownMenuLabel>
        <DropdownMenuItem asChild className="gap-3 px-3 py-2.5 focus:bg-[#f5ecd7]">
          <Link href="/profile"><UserRound size={16} aria-hidden="true" />{t("profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={busy} onSelect={() => void signOut()} className="gap-3 px-3 py-2.5 focus:bg-[#f5ecd7]">
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <LogOut size={16} aria-hidden="true" />}
          {busy ? t("settings.signOutLoading") : t("settings.signOut")}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e0d4b7]" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem disabled={busy} onSelect={(event) => event.preventDefault()} className="gap-3 px-3 py-2.5 text-[#9d3b2e] focus:bg-[#fff1dc] focus:text-[#70251d]">
              <AlertTriangle size={16} aria-hidden="true" />{t("settings.deleteAccount")}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-[#cbbd99] bg-[#fffaf0] text-[#173e37]">
            <AlertDialogHeader>
              <AlertDialogTitle className="display-font flex items-center gap-2 text-3xl text-[#70251d]"><AlertTriangle size={22} aria-hidden="true" />{t("settings.deleteAccountTitle")}</AlertDialogTitle>
              <AlertDialogDescription className="leading-6 text-[#625d50]">{t("settings.deleteAccountDescription")}</AlertDialogDescription>
            </AlertDialogHeader>
            {error && <p role="alert" className="text-sm leading-6 text-[#9d3b2e]">{error}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy} className="border-[#b8aa86] bg-transparent text-[#173e37]">{t("settings.cancel")}</AlertDialogCancel>
              <AlertDialogAction disabled={busy} onClick={(event) => { event.preventDefault(); void deleteAccount(); }} className="bg-[#9d3b2e] text-[#fffaf0] hover:bg-[#70251d]">
                {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                {busy ? t("settings.deleteAccountLoading") : t("settings.confirmDeleteAccount")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
