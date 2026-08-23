import { readFileSync, writeFileSync } from "node:fs";
const query = readFileSync("supabase/migrations/20260823020000_cleanup_legacy_level_two_tactical_curriculum.sql", "utf8");
writeFileSync("/tmp/level-two-cleanup-migration.json", JSON.stringify({
  project_id: "uefeyfyzfoegjkuddnvx",
  name: "cleanup_legacy_level_two_tactical_curriculum",
  query,
}));
