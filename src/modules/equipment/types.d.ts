export interface EquipmentLoadout { weapon: string | null; armor: string | null; trinket: string | null; }
export interface EquipmentRules { slot: string; allowedClasses?: string[]; minLevel?: number; }
export interface EquipmentResult { ok: boolean; reason?: 'invalid-slot' | 'class-restricted' | 'level-restricted'; replaced?: string | null; }
