from uuid import UUID, uuid5

NAMESPACE = UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
for key in ("1", "2", "3"):
    print(f'  "{key}": "{uuid5(NAMESPACE, f"callofchess:lesson:legacy-{key}")}",')
for slug in ("fundamentals-center", "fundamentals-development"):
    print(slug, uuid5(NAMESPACE, f"callofchess:lesson:{slug}"))
