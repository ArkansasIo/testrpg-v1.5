export interface LootRoll { stage: number; luck: number; boss: boolean; seed?: number; }
export interface LootEntry { itemId: string; weight: number; minStage?: number; maxStage?: number; }
export interface LootResult { itemId: string; rarity: string; quantity: number; stats: Record<string, number>; }
