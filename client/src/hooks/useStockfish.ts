import { useCallback, useEffect, useRef, useState } from "react";

type EngineAnalysis = {
  depth: number;
  scoreCp: number | null;
  mate: number | null;
  scoreLabel: string;
  bestMove: string | null;
  principalVariation: string[];
};

type StockfishState = {
  isReady: boolean;
  isAnalyzing: boolean;
  analysis: EngineAnalysis | null;
  error: string | null;
};

const INITIAL_ANALYSIS: EngineAnalysis = {
  depth: 0,
  scoreCp: null,
  mate: null,
  scoreLabel: "—",
  bestMove: null,
  principalVariation: [],
};

export function formatScore(scoreCp: number | null, mate: number | null) {
  if (mate !== null) return `Mat en ${Math.abs(mate)}`;
  if (scoreCp === null) return "—";
  const pawns = scoreCp / 100;
  return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(2)}`;
}

export function parseInfo(line: string, previous: EngineAnalysis): EngineAnalysis | null {
  if (!line.startsWith("info ")) return null;
  const depthMatch = line.match(/\bdepth (\d+)/);
  const scoreMatch = line.match(/\bscore (cp|mate) (-?\d+)/);
  const pvMatch = line.match(/\bpv (.+)$/);
  if (!depthMatch && !scoreMatch && !pvMatch) return null;

  const depth = depthMatch ? Number(depthMatch[1]) : previous.depth;
  const scoreCp = scoreMatch?.[1] === "cp" ? Number(scoreMatch[2]) : scoreMatch?.[1] === "mate" ? null : previous.scoreCp;
  const mate = scoreMatch?.[1] === "mate" ? Number(scoreMatch[2]) : scoreMatch?.[1] === "cp" ? null : previous.mate;
  const principalVariation = pvMatch ? pvMatch[1].trim().split(/\s+/).slice(0, 8) : previous.principalVariation;

  return {
    depth,
    scoreCp,
    mate,
    scoreLabel: formatScore(scoreCp, mate),
    bestMove: previous.bestMove,
    principalVariation,
  };
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<StockfishState>({
    isReady: false,
    isAnalyzing: false,
    analysis: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      setState((current) => ({ ...current, error: "L’analyse locale n’est pas disponible dans ce navigateur." }));
      return;
    }

    const worker = new Worker("/stockfish/stockfish.js");
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<string>) => {
      const line = typeof event.data === "string" ? event.data.trim() : "";
      if (!line) return;

      if (line === "uciok") {
        worker.postMessage("isready");
        return;
      }
      if (line === "readyok") {
        setState((current) => ({ ...current, isReady: true, error: null }));
        return;
      }
      if (line.startsWith("bestmove ")) {
        const bestMove = line.split(/\s+/)[1] ?? null;
        setState((current) => ({
          ...current,
          isAnalyzing: false,
          analysis: current.analysis ? { ...current.analysis, bestMove } : { ...INITIAL_ANALYSIS, bestMove },
        }));
        return;
      }

      setState((current) => {
        const parsed = parseInfo(line, current.analysis ?? INITIAL_ANALYSIS);
        return parsed ? { ...current, analysis: parsed } : current;
      });
    };

    worker.onerror = () => {
      setState((current) => ({ ...current, isAnalyzing: false, error: "Stockfish n’a pas pu démarrer dans ce navigateur." }));
    };

    worker.postMessage("uci");

    return () => {
      worker.postMessage("quit");
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage("stop");
    setState((current) => ({ ...current, isAnalyzing: false }));
  }, []);

  const analyze = useCallback((fen: string, depth = 12) => {
    const worker = workerRef.current;
    if (!worker || !state.isReady) return;
    const safeDepth = Math.min(Math.max(depth, 8), 16);
    worker.postMessage("stop");
    worker.postMessage("ucinewgame");
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${safeDepth}`);
    setState((current) => ({
      ...current,
      isAnalyzing: true,
      analysis: { ...INITIAL_ANALYSIS },
      error: null,
    }));
  }, [state.isReady]);

  return { ...state, analysis: state.analysis, analyze, stop };
}
