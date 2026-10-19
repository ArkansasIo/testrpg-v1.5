import { SAVE_VERSION } from '../../core/constants.js';

export class SaveSerializer {
  static encode(data) { const now = Date.now(); return JSON.stringify({ schemaVersion: SAVE_VERSION, createdAt: now, updatedAt: now, data }); }
  static decode(raw) { if (!raw) return null; const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; if (!parsed || parsed.schemaVersion !== SAVE_VERSION || !parsed.data) throw new Error('Unsupported or invalid save schema'); return parsed; }
}
