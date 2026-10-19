export type AIState = 'idle' | 'patrol' | 'engage' | 'retreat' | 'dead';
export type AIAction = 'attack' | 'defend' | 'heal' | 'move' | 'wait';
export interface AIContext { self: Record<string, unknown>; targets: Record<string, unknown>[]; distance: number; elapsed: number; }
export interface AIDecision { action: AIAction; targetId?: string; score: number; }
