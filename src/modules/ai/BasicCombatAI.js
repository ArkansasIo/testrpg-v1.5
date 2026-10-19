export class BasicCombatAI {
  decide(context) {
    const self = context.self ?? {}; const targets = context.targets ?? [];
    if ((self.hp ?? 0) <= 0) return { action: 'wait', score: 0 };
    const target = [...targets].filter(t => (t.hp ?? 0) > 0).sort((a, b) => (b.threat ?? 0) - (a.threat ?? 0))[0];
    if (!target) return { action: 'wait', score: 0 };
    if ((self.hp / Math.max(1, self.maxHp)) < 0.15 && self.canRetreat) return { action: 'retreat', score: 0.9 };
    return { action: 'attack', targetId: target.id, score: 1 };
  }
}
