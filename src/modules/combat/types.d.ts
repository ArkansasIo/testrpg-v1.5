export type CombatActionId = string;
export type CombatantId = string;
export type CombatResultKind = 'hit' | 'critical' | 'miss' | 'blocked' | 'healed' | 'defeated';
export interface CombatAction { id: CombatActionId; sourceId: CombatantId; targetIds: CombatantId[]; power: number; type: string; }
export interface CombatResult { kind: CombatResultKind; sourceId: CombatantId; targetId: CombatantId; amount: number; critical: boolean; defeated: boolean; }
export interface ThreatEntry { targetId: CombatantId; threat: number; }
