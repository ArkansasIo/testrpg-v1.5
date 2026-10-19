export const lerp = (a, b, t) => a + (b - a) * t;
export const scale = (base, growth, level) => Math.floor(base * Math.pow(growth, Math.max(0, level - 1)));
export const xpToNextLevel = level => Math.floor(100 * Math.pow(Math.max(1, level), 1.8));
export const stageMultiplier = stage => 1 + Math.max(0, stage - 1) * 0.08;
export const rarityMultiplier = index => 1 + index * 0.35;
export const percent = value => Math.max(0, Math.min(100, value));
