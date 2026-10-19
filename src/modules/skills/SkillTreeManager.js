export class SkillTreeManager {
  constructor(tree) { this.tree = tree; this.ranks = {}; this.points = 0; }
  node(id) { return this.tree.nodes.find(node => node.id === id); }
  canLearn(id) { const node = this.node(id); if (!node || this.points < node.cost || (this.ranks[id] ?? 0) >= node.maxRank) return false; return node.prerequisites.every(p => (this.ranks[p] ?? 0) > 0); }
  learn(id) { if (!this.canLearn(id)) return false; const node = this.node(id); this.points -= node.cost; this.ranks[id] = (this.ranks[id] ?? 0) + 1; return true; }
  grantPoints(amount) { this.points += Math.max(0, Math.floor(amount)); }
}
