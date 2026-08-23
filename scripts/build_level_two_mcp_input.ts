import { readFileSync, writeFileSync } from "node:fs";

const query = readFileSync("supabase/migrations/20260823010000_seed_level_two_tactical_curriculum.sql", "utf8");
writeFileSync("/tmp/level-two-apply-migration.json", JSON.stringify({
  project_id: "uefeyfyzfoegjkuddnvx",
  name: "seed_level_two_tactical_curriculum",
  query,
}));
