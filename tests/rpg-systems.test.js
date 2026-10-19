import test from 'node:test';
import assert from 'node:assert/strict';
import { Hero } from '../src/entities/Hero.js';
import { Enemy } from '../src/entities/Enemy.js';
import { WaveSystem } from '../src/systems/WaveSystem.js';
import { GameState } from '../src/state/GameState.js';
import { generateLoot, RARITIES } from '../src/config/lootTables.js';
import { MAX_WAVE_SIZE, BOSS_INTERVAL, waveSizeForStage } from '../src/config/waveConfig.js';
import { HERO_CLASSES, MAX_PARTY_SIZE, xpToNextLevel } from '../src/config/heroClasses.js';
import { BOSS_ROLE, ENEMY_ROLES } from '../src/config/enemyRoles.js';

test('hero classes expose valid starter/recruit configuration', () => {
  assert.ok(HERO_CLASSES.knight);
  assert.equal(HERO_CLASSES.knight.recruitCost, 0);
  assert.ok(Object.values(HERO_CLASSES).some((hero) => hero.recruitCost > 0));
  assert.equal(MAX_PARTY_SIZE, 4);
});

test('hero levels up repeatedly and restores health on each level', () => {
  const hero = new Hero('knight');
  hero.hp = 1;
  const xp = xpToNextLevel(1) + xpToNextLevel(2);
  assert.equal(hero.gainXp(xp), true);
  assert.equal(hero.level, 3);
  assert.equal(hero.hp, hero.maxHp);
  assert.equal(hero.xp, 0);
});

test('hero takes at least one damage and cannot heal past max HP', () => {
  const hero = new Hero('knight');
  assert.equal(hero.takeDamage(0), 1);
  hero.hp = 1;
  hero.heal(999);
  assert.equal(hero.hp, hero.maxHp);
});

test('class-restricted equipment cannot be equipped by a different class', () => {
  const knight = new Hero('knight');
  const ranger = new Hero('ranger');
  const sword = { slot: 'weapon', label: 'Test Sword', allowedClasses: ['knight'], stats: { atk: 3 } };
  assert.equal(knight.canEquip(sword), true);
  assert.equal(knight.equip(sword), true);
  assert.equal(ranger.canEquip(sword), false);
  assert.equal(ranger.equip(sword), false);
  assert.equal(ranger.equipment.weapon, null);
});

test('equipping increases derived stats and unequipping is represented by replacement', () => {
  const hero = new Hero('knight');
  const baseline = hero.atk;
  assert.equal(hero.equip({ slot: 'weapon', stats: { atk: 7 }, label: 'Practice Blade' }), true);
  assert.equal(hero.atk, baseline + 7);
});

test('wave size increases gradually but never exceeds the layout cap', () => {
  assert.equal(waveSizeForStage(1), 1);
  assert.equal(waveSizeForStage(6), 2);
  assert.equal(waveSizeForStage(11), 3);
  assert.equal(waveSizeForStage(16), 4);
  assert.equal(waveSizeForStage(1000), MAX_WAVE_SIZE);
});

test('boss stages spawn exactly one boss enemy', () => {
  for (const stage of [BOSS_INTERVAL, BOSS_INTERVAL * 2, BOSS_INTERVAL * 5]) {
    const wave = WaveSystem.spawnWave(stage);
    assert.equal(wave.length, 1);
    assert.equal(wave[0].role, 'boss');
    assert.ok(wave[0].maxHp > 0);
  }
});

test('normal waves use role definitions and stage-scaled enemy stats', () => {
  const earlyWave = WaveSystem.spawnWave(1);
  const laterWave = WaveSystem.spawnWave(6);
  assert.equal(earlyWave.length, 1);
  assert.equal(earlyWave[0].role, ENEMY_ROLES[0].key);
  assert.equal(laterWave.length, 2);
  assert.ok(laterWave[0].maxHp > earlyWave[0].maxHp);
});

test('boss enrage triggers once at its health threshold', () => {
  const boss = new Enemy(BOSS_INTERVAL, BOSS_ROLE);
  const baseAttack = boss.atk;
  boss.hp = Math.floor(boss.maxHp * 0.5);
  assert.equal(boss.checkEnrage(), true);
  assert.equal(boss.enraged, true);
  assert.ok(boss.atk > baseAttack);
  assert.equal(boss.checkEnrage(), false);
});

test('boss heavy-attack cadence and normal enemy distinction are explicit', () => {
  const boss = new Enemy(BOSS_INTERVAL, BOSS_ROLE);
  const regular = new Enemy(1, ENEMY_ROLES[0]);
  assert.equal(regular.isHeavyAttack(), false);
  for (let i = 0; i < 3; i++) assert.equal(boss.tick(2), true);
  assert.equal(boss.isHeavyAttack(), true);
  assert.equal(regular.isHeavyAttack(), false);
});

test('loot generation returns valid slot, rarity and numeric stat bonuses', () => {
  assert.equal(RARITIES.length, 10);
  for (let i = 0; i < 100; i++) {
    const item = generateLoot(5);
    assert.ok(['weapon', 'armor', 'trinket'].includes(item.slot));
    assert.ok(RARITIES.some((rarity) => rarity.id === item.rarity));
    assert.ok(item.id);
    assert.ok(item.label);
    assert.ok(Object.values(item.stats).every(Number.isFinite));
  }
});

test('game state save round-trip keeps progression, inventory and party', () => {
  const state = new GameState();
  state.addHero('ranger');
  state.stage = 14;
  state.gold = 123;
  state.inventory.push({ id: 'item-1', slot: 'trinket', label: 'Lucky Charm', stats: { atk: 2 } });
  const restored = GameState.fromSave(state.serialize());
  assert.equal(restored.stage, 14);
  assert.equal(restored.gold, 123);
  assert.equal(restored.party.length, 2);
  assert.equal(restored.party[1].classId, 'ranger');
  assert.equal(restored.inventory[0].id, 'item-1');
});
