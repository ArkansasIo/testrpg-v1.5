# RPG Architecture

## Module hierarchy

- `src/core/` — constants, validation, deterministic RNG, progression math, shared contracts.
- `src/modules/combat/` — combat actions, resolution, damage and threat contracts.
- `src/modules/progression/` — XP, levels, skill/talent points.
- `src/modules/inventory/` — item stacks, capacity, add/remove operations.
- `src/modules/equipment/` — slot rules, class restrictions, level restrictions.
- `src/modules/loot/` — seeded loot rolls, rarity and stat generation.
- `src/modules/quests/` — quest state, objectives, progress and rewards.
- `src/modules/dungeons/` — procedural floors, biomes and boss placement.
- `src/modules/crafting/` — recipes, ingredients and crafting validation.
- `src/modules/skills/` — prerequisite-driven skill trees and ranks.
- `src/modules/ai/` — enemy decision making and combat targeting.
- `src/modules/save/` — versioned save envelopes and serialization.
- `src/data/definitions/` — canonical JSON arrays for classes, enemies, abilities and biomes.
- `src/data/schema/` — JSON Schema contracts for persisted and gameplay data.

## Data hierarchy

`GameState -> Party[] -> Hero -> Stats + Abilities[] + Equipment{}`

`GameState -> Inventory[] -> Item -> Stats{}`

`Stage -> Wave -> Enemy[] -> Stats + Abilities[]`

`Dungeon -> Floor[] -> Encounter[] -> Enemy[]`

`SkillTree -> Node[] -> prerequisites[] + effects{}`

`Quest -> Objective[] -> progress/required + rewards{}`

## Design rules

1. Runtime systems own behavior; JSON definitions own content.
2. Arrays represent ordered collections and party/wave/objective membership.
3. Maps/objects represent keyed state such as equipment slots, stats and skill ranks.
4. `.d.ts` files define public TypeScript-compatible contracts without requiring a TypeScript build step.
5. JSON Schema validates serialized data boundaries.
6. Deterministic RNG is available for reproducible tests and procedural generation.
7. New systems should be dependency-light and expose a small public API.
