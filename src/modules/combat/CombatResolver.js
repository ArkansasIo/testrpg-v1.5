import { clamp } from '../../core/validation.js';

export class CombatResolver {
  static rollAttack(source, target, rng = Math.random) {
    const critChance = clamp(Number(source.critChance ?? 5), 0, 100);
    const critical = rng() * 100 < critChance;
    const raw = Math.max(1, Number(source.atk ?? source.attack ?? 1) - Number(target.defense ?? 0));
    const amount = Math.floor(raw * (critical ? Number(source.critDamage ?? 2) : 1));
    return { kind: critical ? 'critical' : 'hit', amount, critical, defeated: amount >= Number(target.hp ?? 1) };
  }

  static applyDamage(target, amount) {
    const damage = Math.max(0, Math.floor(amount));
    target.hp = Math.max(0, Number(target.hp ?? 0) - damage);
    return { damage, defeated: target.hp <= 0 };
  }
}
