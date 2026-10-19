export interface LevelCurve { maxLevel: number; xpToNext: (level: number) => number; }
export interface ProgressionState { level: number; xp: number; skillPoints: number; talentPoints: number; }
export interface LevelUpEvent { previousLevel: number; level: number; levelsGained: number; }
