export class InventoryManager {
  constructor(capacity = 200) { this.capacity = capacity; this.stacks = new Map(); }
  get size() { return this.stacks.size; }
  add(item, quantity = 1) {
    if (!item?.id || quantity <= 0) return { ok: false, reason: 'invalid-item' };
    if (!this.stacks.has(item.id) && this.size >= this.capacity) return { ok: false, reason: 'capacity' };
    const current = this.stacks.get(item.id);
    this.stacks.set(item.id, { item, quantity: (current?.quantity ?? 0) + quantity });
    return { ok: true };
  }
  remove(itemId, quantity = 1) {
    const current = this.stacks.get(itemId);
    if (!current || quantity <= 0 || current.quantity < quantity) return { ok: false, reason: 'insufficient-quantity' };
    current.quantity -= quantity;
    if (!current.quantity) this.stacks.delete(itemId);
    return { ok: true };
  }
  toArray() { return [...this.stacks.values()]; }
}
