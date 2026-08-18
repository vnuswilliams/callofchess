import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type AccountDeletionProps = {
  className?: string;
};

/**
 * Header action that safely deletes the authenticated account after an explicit confirmation.
 * The Supabase RPC must be created with docs/account-deletion.sql before enabling this action in production.
 */
export default function AccountDeletion({ className = "" }: AccountDeletionProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [hasUser, setHasUser] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

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

  async function deleteAccount() {
    setBusy(true);
    setMessage("");
    const { error } = await supabase.rpc("delete_current_user");
    if (error) {
      setMessage(t("settings.deleteAccountError"));
      setBusy(false);
      return;
    }
    await supabase.auth.signOut();
    setBusy(false);
    setLocation("/");
  }

  if (!hasUser) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-2 text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#9d3b2e] transition-colors hover:text-[#70251d] ${className}`}
        >
          <Trash2 size={15} aria-hidden="true" />
          <span>{t("settings.deleteAccount")}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-[#cbbd99] bg-[#fffaf0] text-[#173e37]">
        <AlertDialogHeader>
          <AlertDialogTitle className="display-font flex items-center gap-2 text-3xl text-[#70251d]">
            <AlertTriangle size={22} aria-hidden="true" />
            {t("settings.deleteAccountTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-6 text-[#625d50]">
            {t("settings.deleteAccountDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {message && <p role="alert" className="text-sm leading-6 text-[#9d3b2e]">{message}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy} className="border-[#b8aa86] bg-transparent text-[#173e37]">{t("settings.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(event) => {
              event.preventDefault();
              void deleteAccount();
            }}
            className="bg-[#9d3b2e] text-[#fffaf0] hover:bg-[#70251d]"
          >
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {busy ? t("settings.deleteAccountLoading") : t("settings.confirmDeleteAccount")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
