export class RNG {
  constructor(seed = Date.now()) { this.seed = (seed >>> 0) || 1; }
  next() { let x = this.seed; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.seed = x >>> 0; return this.seed / 4294967296; }
  int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  pick(values) { if (!values.length) return undefined; return values[this.int(0, values.length - 1)]; }
  weighted(entries) { const total = entries.reduce((sum, e) => sum + Math.max(0, e.weight), 0); if (!total) return entries[0]?.value; let roll = this.next() * total; for (const entry of entries) { roll -= Math.max(0, entry.weight); if (roll < 0) return entry.value; } return entries.at(-1)?.value; }
}
