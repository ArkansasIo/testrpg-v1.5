export function isFiniteNumber(value) { return typeof value === 'number' && Number.isFinite(value); }
export function assertString(value, name) { if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} must be a non-empty string`); }
export function assertPositiveInt(value, name) { if (!Number.isInteger(value) || value < 0) throw new TypeError(`${name} must be a non-negative integer`); }
export function assertEnum(value, allowed, name) { if (!allowed.includes(value)) throw new TypeError(`${name} must be one of: ${allowed.join(', ')}`); }
export function assertArray(value, name) { if (!Array.isArray(value)) throw new TypeError(`${name} must be an array`); }
export function assertObject(value, name) { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`); }
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function deepClone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
