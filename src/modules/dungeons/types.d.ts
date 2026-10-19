export type DungeonDifficulty = 'normal' | 'hard' | 'heroic' | 'mythic' | 'nightmare';
export interface DungeonFloor { index: number; biome: string; encounterIds: string[]; bossId?: string; }
export interface DungeonDefinition { id: string; name: string; difficulty: DungeonDifficulty; floors: DungeonFloor[]; recommendedLevel: number; }
export interface DungeonRun { dungeonId: string; floor: number; seed: number; deaths: number; completed: boolean; }
