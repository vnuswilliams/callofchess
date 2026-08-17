import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

type BoardStep = { fen: string; move: Move | null };

function createAnimatedGame(): BoardStep[] {
  const chess = new Chess();
  const steps: BoardStep[] = [{ fen: chess.fen(), move: null }];
  let seed = Math.floor(Date.now() / 60000) % 997;

  for (let turn = 0; turn < 28 && !chess.isGameOver(); turn += 1) {
    const moves = chess.moves({ verbose: true });
    if (!moves.length) break;
    seed = (seed * 37 + 17) % 997;
    const move = moves[seed % moves.length];
    const played = chess.move(move.san);
    steps.push({ fen: chess.fen(), move: played });
  }
  return steps;
}

export default function LandingChessboard() {
  const { language } = useLanguage();
  const fr = language === "fr";
  const gameSteps = useMemo(() => createAnimatedGame(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [position, setPosition] = useState(gameSteps[0]?.fen ?? new Chess().fen());
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("call-of-chess:sound") !== "off");
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playMoveSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(680, context.currentTime + 0.07);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.13);
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((current) => {
      const next = !current;
      localStorage.setItem("call-of-chess:sound", next ? "on" : "off");
      if (next) playMoveSound();
      return next;
    });
  }, [playMoveSound]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setPosition(gameSteps[0]?.fen ?? new Chess().fen());
    setPlaying(true);
  }, [gameSteps]);

  useEffect(() => {
    if (!playing) return undefined;
    timerRef.current = window.setInterval(() => {
      setStepIndex((current) => {
        const next = current + 1;
        if (next >= gameSteps.length) {
          setPlaying(false);
          return current;
        }
        setPosition(gameSteps[next].fen);
        playMoveSound();
        return next;
      });
    }, 1150);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [gameSteps.length, playing, gameSteps, playMoveSound]);

  function movePiece(sourceSquare: string, targetSquare: string) {
    if (playing) return false;
    try {
      const chess = new Chess(position);
      const move = chess.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
      if (!move) return false;
      setPosition(chess.fen());
      return true;
    } catch {
      return false;
    }
  }

  const currentMove = gameSteps[stepIndex]?.move;
  const moveLabel = currentMove ? `${currentMove.color === "w" ? Math.ceil(stepIndex / 2) : Math.ceil(stepIndex / 2)}. ${currentMove.san}` : fr ? "Position de départ" : "Starting position";

  return (
    <div className="landing-board-shell w-[min(92vw,560px)] max-w-full rounded-[.9rem] bg-[#153d36] p-3 shadow-[22px_26px_0_rgba(31,32,22,.14),0_22px_48px_rgba(24,42,35,.24)] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3 text-[#fffaf0]">
        <div>
          <p className="eyebrow !text-[#e6b95e]">{fr ? "Partie en direct" : "Live game"}</p>
          <p className="mt-1 text-xs text-[#cbd8cc]">{fr ? "Une partie générée à l’arrivée" : "A game generated on arrival"}</p>
        </div>
        <span className="rounded-full border border-[#66857c] px-2.5 py-1 font-mono text-[.65rem] text-[#e6b95e]">{stepIndex}/{gameSteps.length - 1}</span>
      </div>
      <div className="overflow-hidden rounded-[.45rem] border border-[#fff6e5]/50">
        <Chessboard options={{ id: "landing-live-board", position, boardOrientation: "white", showNotation: true, allowDragging: !playing, animationDurationInMs: 420, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f4e5c2" }, canDragPiece: ({ piece }) => !playing && piece.pieceType.startsWith(position.includes(" w ") ? "w" : "b"), onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? movePiece(sourceSquare, targetSquare) : false }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 flex-1 truncate font-mono text-xs text-[#e6b95e]" aria-live="polite">{moveLabel}</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={() => setPlaying((current) => !current)} className="rounded-[.55rem] bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]" aria-label={playing ? (fr ? "Mettre la partie en pause" : "Pause game") : (fr ? "Reprendre la partie" : "Resume game")}>
            {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? (fr ? "Pause" : "Pause") : (fr ? "Jouer" : "Play")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={reset} className="rounded-[.55rem] border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#285448]" aria-label={fr ? "Rejouer la partie" : "Restart game"}>
            <RotateCcw size={14} />
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={toggleSound} className="rounded-[.55rem] border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#285448]" aria-pressed={!soundEnabled} aria-label={soundEnabled ? (fr ? "Couper les sons" : "Mute sounds") : (fr ? "Activer les sons" : "Enable sounds")}>
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </Button>
        </div>
      </div>
      {!playing && stepIndex === 0 && <p className="mt-2 text-[.68rem] text-[#cbd8cc]">{fr ? "Mettez la partie en pause pour essayer vos propres coups." : "Pause the game to try your own moves."}</p>}
    </div>
  );
}

export { createAnimatedGame };
