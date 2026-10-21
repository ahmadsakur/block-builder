# Add-ons

Recipes for optional layers on top of a backend branch. One file per add-on: `<name>.md`.

Each recipe states:

- **Fits:** the backends it works with.
- **Changes:** the files it touches (normally `service/` bodies, env and new files only; `ui/` and `query/` stay untouched).
- **Decisions** to ask the owner before applying.
- **Steps**, then **Verify**.

A recipe that fits a single backend lives on that backend's branch. A recipe that fits several lives here on `base`.
