from __future__ import annotations

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "client" / "src" / "locales"
fr_files = sorted((root / "fr").glob("*.json"))
en_files = sorted((root / "en").glob("*.json"))
assert [p.name for p in fr_files] == [p.name for p in en_files], "Locale domains differ"
for fr_path, en_path in zip(fr_files, en_files):
    fr = json.loads(fr_path.read_text())
    en = json.loads(en_path.read_text())
    assert set(fr) == set(en), f"Key mismatch in {fr_path.name}"
    print(f"{fr_path.name}: {len(fr)} keys")
print(f"Validated {len(fr_files)} locale domains.")
