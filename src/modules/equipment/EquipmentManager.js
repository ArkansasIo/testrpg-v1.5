export class EquipmentManager {
  constructor(slots = ['weapon', 'armor', 'trinket']) { this.slots = Object.fromEntries(slots.map(slot => [slot, null])); }
  canEquip(hero, item) {
    if (!item || !(item.slot in this.slots)) return { ok: false, reason: 'invalid-slot' };
    if (item.allowedClasses?.length && !item.allowedClasses.includes(hero.classId)) return { ok: false, reason: 'class-restricted' };
    if (item.level && Number(hero.level) < item.level) return { ok: false, reason: 'level-restricted' };
    return { ok: true };
  }
  equip(hero, item) {
    const result = this.canEquip(hero, item);
    if (!result.ok) return result;
    const replaced = this.slots[item.slot]?.id ?? null;
    this.slots[item.slot] = item;
    return { ok: true, replaced };
  }
  unequip(slot) { const item = this.slots[slot] ?? null; this.slots[slot] = null; return item; }
}
