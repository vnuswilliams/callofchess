import { Chess } from "chess.js";
import { levelTwoLessons } from "../client/src/lib/levelTwoLessons";

for (const [key, lesson] of Object.entries(levelTwoLessons)) {
  lesson.steps.forEach((step, index) => {
    try {
      const game = new Chess(step.positionFen ?? lesson.startingFen);
      const move = game.move({ from: step.from, to: step.to, promotion: "q" });
      if (step.reply) game.move(step.reply);
      console.log(`${key}/${index + 1} OK ${move.san}`);
    } catch (error) {
      console.log(`${key}/${index + 1} FAIL ${step.from}-${step.to} ${step.san}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}
