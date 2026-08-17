from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path('/home/ubuntu/echequier')
FILES = [*ROOT.glob('client/src/pages/*.tsx'), *ROOT.glob('client/src/components/*.tsx'), *ROOT.glob('client/src/lib/*.ts')]
PATTERN = re.compile(
    r'(?P<condition>\b(?:language\s*===\s*["\']fr["\']|fr))\s*\?\s*'
    r'(?P<fr>["\'](?:\\.|[^"\'])*["\'])\s*:\s*'
    r'(?P<en>["\'](?:\\.|[^"\'])*["\'])'
)

def decode(value: str) -> str:
    return json.loads(value.replace("'", '"')) if value.startswith("'") else json.loads(value)

def main() -> None:
    fr = json.loads((ROOT / 'client/src/locales/fr/common.json').read_text())
    en = json.loads((ROOT / 'client/src/locales/en/common.json').read_text())
    replacements = 0
    for path in FILES:
        source = path.read_text()
        def replace(match: re.Match[str]) -> str:
            nonlocal replacements
            fr_value, en_value = decode(match.group('fr')), decode(match.group('en'))
            digest = hashlib.sha1(f'{fr_value}\0{en_value}'.encode()).hexdigest()[:10]
            key = f'inline_{digest}'
            fr.setdefault(key, fr_value)
            en.setdefault(key, en_value)
            replacements += 1
            return f't("{key}")'
        updated = PATTERN.sub(replace, source)
        if updated != source:
            path.write_text(updated)
    (ROOT / 'client/src/locales/fr/common.json').write_text(json.dumps(fr, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'client/src/locales/en/common.json').write_text(json.dumps(en, ensure_ascii=False, indent=2) + '\n')
    print(f'Migrated {replacements} inline bilingual string conditionals.')

if __name__ == '__main__':
    main()
