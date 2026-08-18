import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Home } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getNotFoundPuzzlePosition,
  selectNotFoundPuzzle,
  type NotFoundPuzzle,
} from "@/lib/notFoundPuzzles";

function getInitialPuzzle(): NotFoundPuzzle {
  if (typeof window === "undefined") return selectNotFoundPuzzle();

  const previousId = window.sessionStorage.getItem("call-of-chess:last-404-mate");
  const puzzle = selectNotFoundPuzzle(previousId ?? undefined);
  window.sessionStorage.setItem("call-of-chess:last-404-mate", puzzle.id);
  return puzzle;
}

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [puzzle, setPuzzle] = useState<NotFoundPuzzle>(getInitialPuzzle);
  const [mated, setMated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const handleGoHome = () => {
    setLocation("/");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setMated(true);
      return undefined;
    }

    setMated(false);
    const mateTimer = window.setTimeout(() => setMated(true), 1800);
    const nextPuzzleTimer = window.setTimeout(() => {
      const nextPuzzle = selectNotFoundPuzzle(puzzle.id);
      window.sessionStorage.setItem("call-of-chess:last-404-mate", nextPuzzle.id);
      setPuzzle(nextPuzzle);
    }, 5200);

    return () => {
      window.clearTimeout(mateTimer);
      window.clearTimeout(nextPuzzleTimer);
    };
  }, [prefersReducedMotion, puzzle.id]);

  const position = useMemo(() => getNotFoundPuzzlePosition(puzzle, mated), [puzzle, mated]);
  const boardStyles = useMemo(() => {
    if (!mated) return {};
    return {
      [puzzle.from]: { backgroundColor: "rgba(214, 144, 36, .52)" },
      [puzzle.to]: { backgroundColor: "rgba(230, 185, 94, .72)" },
    };
  }, [mated, puzzle.from, puzzle.to]);
  const status = mated ? `${t("common.notFound.puzzleCheckmate")} · ${puzzle.san}` : t("common.notFound.puzzleThinking");

  return (
    <div className="page-shell not-found-shell min-h-screen w-full overflow-hidden px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
      <div className="not-found-grain" aria-hidden="true" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <main className="not-found-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--coc-line)] bg-[var(--coc-surface-raised)] shadow-[var(--coc-shadow-md)] lg:grid-cols-[1.05fr_.95fr]">
          <section className="not-found-copy relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="not-found-kicker rise-in" aria-hidden="true">
              <span className="not-found-kicker-dot" />
              <span>{t("common.notFound.eyebrow")}</span>
            </div>

            <div className="not-found-code display-font rise-in-delay" aria-hidden="true">404</div>

            <h1 className="not-found-title rise-in-delay-2">{t("common.notFound.title")}</h1>

            <p className="not-found-description rise-in-delay-3">{t("common.notFound.description")}</p>

            <div className="rise-in-delay-4">
              <Button onClick={handleGoHome} className="button-ink not-found-action group rounded-[.7rem] px-5 shadow-none">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>{t("common.notFound.home")}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </div>

            <div className="not-found-rule rise-in-delay-4" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </section>

          <section className="not-found-visual">
            <div className="not-found-visual-label">Call of Chess · {t("common.notFound.pathLabel")}</div>
            <div className="not-found-puzzle-label">{t("common.notFound.puzzleLabel")}</div>
            <div className="not-found-notation" aria-hidden="true">
              <span>e4</span>
              <span>Nf3</span>
              <span>…</span>
            </div>
            <div className="not-found-orbit not-found-orbit-one" aria-hidden="true" />
            <div className="not-found-orbit not-found-orbit-two" aria-hidden="true" />

            <div className={`not-found-board-frame ${mated ? "not-found-board-frame-mated" : ""}`}>
              <div className="not-found-mate-board" role="img" aria-label={`${t("common.notFound.puzzleLabel")} — ${status}`}>
                <Chessboard
                  options={{
                    id: "not-found-mate-board",
                    position,
                    boardOrientation: "white",
                    showNotation: true,
                    allowDragging: false,
                    animationDurationInMs: prefersReducedMotion ? 0 : 760,
                    squareStyles: boardStyles,
                    darkSquareStyle: { backgroundColor: "#3a6658" },
                    lightSquareStyle: { backgroundColor: "#f4e5c2" },
                  }}
                />
              </div>
            </div>

            <span className="not-found-coordinate not-found-coordinate-top" aria-hidden="true">e4</span>
            <span className="not-found-coordinate not-found-coordinate-bottom" aria-hidden="true">?</span>
            <span className="not-found-coordinate not-found-coordinate-side" aria-hidden="true">↗</span>
            <div className="not-found-puzzle-status" aria-live="polite">{status}</div>
            <div className="not-found-notation-caption">{t("common.notFound.notationCaption")}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
