export { RNG } from '../core/rng.js';
export * from '../core/constants.js';
export * from '../core/math.js';
export * from '../core/validation.js';

export const MODULES = Object.freeze([
  'core', 'combat', 'progression', 'inventory', 'equipment', 'loot', 'waves',
  'quests', 'dungeons', 'crafting', 'skills', 'ai', 'save', 'settings', 'ui'
]);

export function createModuleManifest(id, version, dependencies = [], exports = []) {
  return Object.freeze({ id, version, dependencies: [...dependencies], exports: [...exports] });
}
