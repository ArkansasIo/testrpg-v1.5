import { RNG } from '../../core/rng.js';

export class DungeonGenerator {
  static create(id, floors = 10, seed = 1) {
    const rng = new RNG(seed); const biomes = ['forest','crypt','cavern','ruins','volcanic','frost','arcane','shadow'];
    return { id, name: id, difficulty: 'normal', recommendedLevel: Math.max(1, Math.ceil(floors / 2)), floors: Array.from({ length: floors }, (_, i) => ({ index: i + 1, biome: rng.pick(biomes), encounterIds: Array.from({ length: rng.int(2, 4) }, (_, n) => `encounter-${i + 1}-${n + 1}`), bossId: i === floors - 1 ? `boss-${id}` : undefined })) };
  }
}
