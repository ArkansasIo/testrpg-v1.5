import { MAX_LEVEL } from '../../core/constants.js';
import { xpToNextLevel } from '../../core/math.js';

export class ProgressionManager {
  constructor(level = 1, xp = 0) { this.level = level; this.xp = xp; this.skillPoints = 0; this.talentPoints = 0; }
  addXp(amount) {
    this.xp += Math.max(0, Math.floor(amount));
    const previousLevel = this.level;
    while (this.level < MAX_LEVEL && this.xp >= xpToNextLevel(this.level)) {
      this.xp -= xpToNextLevel(this.level); this.level++; this.skillPoints++; this.talentPoints++;
    }
    return { previousLevel, level: this.level, levelsGained: this.level - previousLevel };
  }
  snapshot() { return { level: this.level, xp: this.xp, skillPoints: this.skillPoints, talentPoints: this.talentPoints }; }
}
