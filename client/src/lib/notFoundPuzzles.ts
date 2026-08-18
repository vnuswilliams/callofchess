export type NotFoundPuzzle = {
  id: string;
  fen: string;
  from: string;
  to: string;
  san: string;
};

export const NOT_FOUND_PUZZLES: readonly NotFoundPuzzle[] = [
  { id: "queen-a8", fen: "k1KQ4/8/8/8/8/8/8/8 w - - 0 1", from: "d8", to: "a5", san: "Qa5#" },
  { id: "queen-a1", fen: "8/8/8/8/8/8/8/k1KQ4 w - - 0 1", from: "d1", to: "a4", san: "Qa4#" },
  { id: "queen-h8", fen: "4QK1k/8/8/8/8/8/8/8 w - - 0 1", from: "e8", to: "h5", san: "Qh5#" },
  { id: "queen-h1", fen: "8/8/8/8/8/8/8/4QK1k w - - 0 1", from: "e1", to: "h4", san: "Qh4#" },
  { id: "rook-a8", fen: "k1K5/8/1R6/8/8/8/8/8 w - - 0 1", from: "b6", to: "a6", san: "Ra6#" },
  { id: "rook-a1", fen: "8/8/8/8/8/1R6/8/k1K5 w - - 0 1", from: "b3", to: "a3", san: "Ra3#" },
  { id: "rook-h8", fen: "5K1k/8/6R1/8/8/8/8/8 w - - 0 1", from: "g6", to: "h6", san: "Rh6#" },
  { id: "rook-h1", fen: "8/8/8/8/8/6R1/8/5K1k w - - 0 1", from: "g3", to: "h3", san: "Rh3#" },
];

export function selectNotFoundPuzzle(previousId?: string, random = Math.random): NotFoundPuzzle {
  const candidates = NOT_FOUND_PUZZLES.filter((puzzle) => puzzle.id !== previousId);
  const pool = candidates.length > 0 ? candidates : NOT_FOUND_PUZZLES;
  return pool[Math.floor(random() * pool.length)] ?? NOT_FOUND_PUZZLES[0];
}

export function getNotFoundPuzzlePosition(puzzle: NotFoundPuzzle, mated: boolean): string {
  if (!mated) return puzzle.fen;

  const [board, turn, castling, enPassant, halfmove, fullmove] = puzzle.fen.split(" ");
  const files = "abcdefgh";
  const rows = board.split("/").map((row) => {
    const expanded: string[] = [];
    for (const char of row) {
      if (/\d/.test(char)) expanded.push(...Array(Number(char)).fill("1"));
      else expanded.push(char);
    }
    return expanded;
  });
  const fromFile = files.indexOf(puzzle.from[0]);
  const fromRank = 8 - Number(puzzle.from[1]);
  const toFile = files.indexOf(puzzle.to[0]);
  const toRank = 8 - Number(puzzle.to[1]);
  const movingPiece = rows[fromRank]?.[fromFile];
  if (!movingPiece || !rows[toRank]) return puzzle.fen;
  rows[fromRank][fromFile] = "1";
  rows[toRank][toFile] = movingPiece;

  const compressed = rows.map((row) => {
    let result = "";
    let empty = 0;
    for (const cell of row) {
      if (cell === "1") empty += 1;
      else {
        if (empty) result += empty;
        empty = 0;
        result += cell;
      }
    }
    if (empty) result += empty;
    return result;
  });

  return `${compressed.join("/")} ${turn} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
}
