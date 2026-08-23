import { Chess } from "chess.js";
import { correctedTacticalSteps } from "../client/src/lib/correctedTacticalSteps";

for (const [lesson, steps] of Object.entries(correctedTacticalSteps)) {
  steps.forEach(([fen, from, to, san], index) => {
    try {
      const game = new Chess(fen);
      const move = game.move({ from, to, promotion: "q" });
      if (move.san !== san) throw new Error(`SAN attendu ${san}, obtenu ${move.san}`);
      console.log(`${lesson}/${index + 1} OK ${move.san}${game.isCheck() ? " check" : ""}`);
    } catch (error) {
      console.log(`${lesson}/${index + 1} FAIL ${from}-${to} ${san}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}
