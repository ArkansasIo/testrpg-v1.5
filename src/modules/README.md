# RPG Modules

This directory contains the expanded RPG subsystem layer. Existing prototype systems remain compatible; these modules are intentionally standalone so they can be integrated incrementally.

Every module may contain:

- `types.d.ts` — public types, sub-types and array contracts.
- `*.js` — runtime implementation.
- Future `data/`, `adapters/`, `services/`, `events/` and `tests/` submodules as the game grows.

Recommended dependency direction:

`core -> data -> domain modules -> UI/adapters`

Domain modules should not import Electron or PixiJS directly.
