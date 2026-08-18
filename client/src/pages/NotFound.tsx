import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="page-shell not-found-shell min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-lg rounded-2xl border border-[var(--coc-line)] bg-[var(--coc-surface-raised)] shadow-[var(--coc-shadow-md)] backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[var(--coc-ink)] mb-2">404</h1>

          <h2 className="text-xl font-semibold text-[var(--coc-ink)] mb-4">
            {t("common.notFound.title")}
          </h2>

          <p className="text-[var(--coc-muted)] mb-8 leading-relaxed">
            {t("common.notFound.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="button-ink rounded-[.7rem] px-6 py-2.5 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("common.notFound.home")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
