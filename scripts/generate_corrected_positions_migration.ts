import { writeFileSync } from "node:fs";
import { correctedTacticalSteps } from "../client/src/lib/correctedTacticalSteps";

const ids: Record<string, string> = {
  "13": "c2130001-2b00-4e00-9000-000000000001",
  "14": "c2130002-2b00-4e00-9000-000000000002",
  "15": "c2130003-2b00-4e00-9000-000000000003",
  "16": "c2130004-2b00-4e00-9000-000000000004",
  "17": "c2130005-2b00-4e00-9000-000000000005",
  "18": "c2130006-2b00-4e00-9000-000000000006",
  "19": "c2130007-2b00-4e00-9000-000000000007",
  "20": "c2130008-2b00-4e00-9000-000000000008",
  "21": "c2130009-2b00-4e00-9000-000000000009",
  "22": "c2130010-2b00-4e00-9000-000000000010",
  "23": "c2130011-2b00-4e00-9000-000000000011",
  "24": "c2130012-2b00-4e00-9000-000000000012",
  "25": "c2130013-2b00-4e00-9000-000000000013",
  "26": "c2130014-2b00-4e00-9000-000000000014",
  "27": "c2130015-2b00-4e00-9000-000000000015",
  "28": "c2130016-2b00-4e00-9000-000000000016",
};

const rows = Object.entries(correctedTacticalSteps).map(([key, specs]) => {
  const steps = specs.map(([positionFen, from, to, san, answer_fr, answer_en, idea_fr, idea_en]) => ({ from, to, san, answer_fr, answer_en, idea_fr, idea_en }));
  return `  ('${ids[key]}', '${specs[0][0]}', $$${JSON.stringify(steps)}$$::jsonb)`;
});

const sql = `-- Corrige les positions interactives des 16 motifs tactiques fondamentaux.\n-- Générée depuis correctedTacticalSteps.ts après validation chess.js.\nbegin;\nwith payload(id, starting_fen, steps) as (\nvalues\n${rows.join(",\n")}\n)\nupdate public.lessons as lesson\nset starting_fen = payload.starting_fen,\n    steps = payload.steps,\n    updated_at = now()\nfrom payload\nwhere lesson.id = payload.id;\ncommit;\n`;

writeFileSync("supabase/migrations/20260823030000_correct_level_two_tactical_positions.sql", sql);
