import { RNG } from '../../core/rng.js';
import { RARITY_ORDER } from '../../core/constants.js';

export class LootGenerator {
  constructor(seed) { this.rng = new RNG(seed); }
  rarity(stage, boss = false) {
    const pressure = Math.min(0.95, 0.08 + stage * 0.006 + (boss ? 0.12 : 0));
    let index = 0; for (let i = 1; i < RARITY_ORDER.length; i++) if (this.rng.next() < pressure / (i + 1)) index = i;
    return RARITY_ORDER[index];
  }
  generate(stage, boss = false) {
    const rarity = this.rarity(stage, boss);
    const id = `${rarity}-drop-${this.rng.int(1, 999999)}`;
    return { itemId: id, rarity, quantity: boss ? this.rng.int(1, 3) : 1, stats: { atk: Math.max(1, Math.floor(stage * (1 + RARITY_ORDER.indexOf(rarity) * 0.35))) } };
  }
}
