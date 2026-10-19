export interface InventoryStack { itemId: string; quantity: number; }
export interface InventoryState { capacity: number; stacks: InventoryStack[]; gold: number; }
export interface InventoryResult { ok: boolean; reason?: 'capacity' | 'invalid-item' | 'insufficient-quantity'; }
