from uuid import NAMESPACE_URL, uuid5

for slug in ["level-zero-exercise-1", "level-zero-exercise-2", "level-zero-exercise-3", "level-zero-exercise-4", "level-zero-exercise-5", "level-zero-exercise-6"]:
    print(slug, uuid5(NAMESPACE_URL, f"https://callofchess.app/{slug}"))
