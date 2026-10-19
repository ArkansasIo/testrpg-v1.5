export interface SkillNode { id: string; name: string; maxRank: number; cost: number; prerequisites: string[]; effects: Record<string, number>; }
export interface SkillTree { id: string; nodes: SkillNode[]; }
export interface SkillState { ranks: Record<string, number>; points: number; }
