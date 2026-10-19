export class QuestManager {
  constructor(definitions = []) { this.quests = new Map(definitions.map(q => [q.id, { ...q, status: 'available', objectives: q.objectives.map(o => ({ ...o })) }])); }
  accept(id) { const q = this.quests.get(id); if (!q || q.status !== 'available') return false; q.status = 'active'; return true; }
  progress(id, objectiveId, amount = 1) { const q = this.quests.get(id); if (!q || q.status !== 'active') return false; const objective = q.objectives.find(o => o.id === objectiveId); if (!objective) return false; objective.progress = Math.min(objective.required, objective.progress + Math.max(0, amount)); if (q.objectives.every(o => o.progress >= o.required)) q.status = 'completed'; return true; }
  claim(id) { const q = this.quests.get(id); if (!q || q.status !== 'completed') return null; q.status = 'claimed'; return { ...q.rewards }; }
  toArray() { return [...this.quests.values()]; }
}
