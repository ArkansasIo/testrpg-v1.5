export interface Ingredient { itemId: string; quantity: number; }
export interface Recipe { id: string; name: string; ingredients: Ingredient[]; outputItemId: string; outputQuantity: number; requiredLevel?: number; }
export interface CraftResult { ok: boolean; reason?: 'missing-ingredient' | 'level-restricted' | 'invalid-recipe'; }
