export type ID = string;
export type Int = number;
export type Float = number;
export type Percent = number;
export type Timestamp = number;

export type RarityId = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ancient' | 'divine' | 'celestial' | 'prismatic';
export type EquipmentSlot = 'weapon' | 'armor' | 'trinket';
export type HeroClassId = 'knight' | 'ranger' | 'mage' | 'rogue' | 'cleric' | 'berserker' | 'paladin' | 'necromancer';
export type EnemyRoleId = string;
export type DamageType = 'physical' | 'fire' | 'ice' | 'lightning' | 'poison' | 'arcane' | 'holy' | 'shadow';
export type TargetKind = 'single' | 'all' | 'lowest-hp' | 'highest-threat';

export interface Stats {
  hp?: Int; maxHp?: Int; atk?: Int; defense?: Int; speed?: Int; critChance?: Percent; critDamage?: Percent;
  resistance?: Partial<Record<DamageType, Percent>>;
  [key: string]: number | Partial<Record<DamageType, number>> | undefined;
}

export interface ItemData {
  id: ID; label: string; slot: EquipmentSlot; rarity: RarityId; level?: Int;
  allowedClasses?: HeroClassId[]; stats: Stats; value?: Int; stackable?: boolean;
}

export interface AbilityData {
  id: ID; name: string; level?: Int; cooldown: Float; cost?: Int; damage?: Int;
  damageType?: DamageType; target: TargetKind; tags?: string[];
}

export interface HeroData {
  id: ID; classId: HeroClassId; name: string; level: Int; xp: Int; hp: Int; maxHp: Int;
  stats: Stats; abilities: AbilityData[]; equipment: Partial<Record<EquipmentSlot, ItemData | null>>;
}

export interface EnemyData {
  id: ID; role: EnemyRoleId; stage: Int; level: Int; hp: Int; maxHp: Int; stats: Stats;
  abilities: AbilityData[]; boss?: boolean; enraged?: boolean;
}

export interface WaveData {
  stage: Int; enemies: EnemyData[]; boss: boolean; seed?: number;
}

export interface GameStateData {
  version: Int; stage: Int; gold: Int; xp: Int; party: HeroData[]; inventory: ItemData[];
  defeatedEnemies: Int; settings: Record<string, unknown>; updatedAt: Timestamp;
}

export interface LootRollContext { stage: Int; luck?: Percent; boss?: boolean; seed?: number; }
export interface LootTableEntry { itemId: ID; weight: Float; minStage?: Int; maxStage?: Int; }

export interface ModuleManifest {
  id: ID; version: string; dependencies: ID[]; exports: string[]; featureFlags?: string[];
}
