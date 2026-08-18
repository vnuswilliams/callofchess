from uuid import NAMESPACE_URL, uuid5

for slug in ["level-zero-lesson-1", "level-zero-lesson-2", "level-zero-lesson-3", "level-zero-lesson-4", "level-zero-lesson-5", "level-zero-lesson-6"]:
    print(slug, uuid5(NAMESPACE_URL, f"https://callofchess.app/{slug}"))
