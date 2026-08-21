import { Chess, type Move } from "chess.js";

export type GameResult = "playing" | "checkmate" | "stalemate" | "draw";

const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const gentleOpening = [
  "e7e5",
  "d7d5",
  "g8f6",
  "b8c6",
  "f8c5",
  "f8b4",
  "e8g8",
  "d8e7",
  "a7a6",
  "h7h6",
];

function moveKey(move: Move) {
  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

export function chooseBeginnerMove(game: Chess): Move | null {
  const legalMoves = game.moves({ verbose: true });
  if (!legalMoves.length) return null;

  const captures = legalMoves
    .filter((move) => Boolean(move.captured))
    .sort((left, right) => {
      const captureDifference = (pieceValues[right.captured ?? "p"] ?? 0) - (pieceValues[left.captured ?? "p"] ?? 0);
      if (captureDifference !== 0) return captureDifference;
      return moveKey(left).localeCompare(moveKey(right));
    });
  if (captures.length) return captures[0];

  for (const preferred of gentleOpening) {
    const move = legalMoves.find((candidate) => moveKey(candidate) === preferred);
    if (move) return move;
  }

  const nonForcing = legalMoves.filter((move) => !move.san.includes("+"));
  return (nonForcing.length ? nonForcing : legalMoves).slice().sort((left, right) => moveKey(left).localeCompare(moveKey(right)))[0] ?? null;
}

export function describeGameResult(game: Chess): GameResult {
  if (game.isCheckmate()) return "checkmate";
  if (game.isStalemate()) return "stalemate";
  if (game.isDraw()) return "draw";
  return "playing";
}
