import test from 'node:test';
import assert from 'node:assert/strict';
import { RNG } from '../src/core/rng.js';
import { CombatResolver } from '../src/modules/combat/CombatResolver.js';
import { InventoryManager } from '../src/modules/inventory/InventoryManager.js';
import { EquipmentManager } from '../src/modules/equipment/EquipmentManager.js';
import { ProgressionManager } from '../src/modules/progression/ProgressionManager.js';
import { LootGenerator } from '../src/modules/loot/LootGenerator.js';
import { QuestManager } from '../src/modules/quests/QuestManager.js';
import { DungeonGenerator } from '../src/modules/dungeons/DungeonGenerator.js';
import { SkillTreeManager } from '../src/modules/skills/SkillTreeManager.js';
import { BasicCombatAI } from '../src/modules/ai/BasicCombatAI.js';
import { SaveSerializer } from '../src/modules/save/SaveSerializer.js';

test('RNG is deterministic for the same seed', () => {
  const a = new RNG(123); const b = new RNG(123);
  assert.deepEqual([a.next(), a.next(), a.next()], [b.next(), b.next(), b.next()]);
});

test('combat resolver applies damage and defeat state', () => {
  const target = { hp: 10, defense: 2 };
  const result = CombatResolver.rollAttack({ atk: 12, critChance: 0 }, target, () => 1);
  assert.equal(result.amount, 10);
  assert.equal(CombatResolver.applyDamage(target, result.amount).defeated, true);
});

test('inventory enforces capacity and quantities', () => {
  const inventory = new InventoryManager(1);
  assert.equal(inventory.add({ id: 'ore' }, 3).ok, true);
  assert.equal(inventory.add({ id: 'herb' }).ok, false);
  assert.equal(inventory.remove('ore', 2).ok, true);
  assert.equal(inventory.toArray()[0].quantity, 1);
});

test('equipment manager enforces class restrictions', () => {
  const manager = new EquipmentManager();
  const hero = { classId: 'knight', level: 5 };
  assert.equal(manager.equip(hero, { id: 'sword', slot: 'weapon', allowedClasses: ['knight'] }).ok, true);
  assert.equal(manager.equip({ classId: 'mage', level: 5 }, { id: 'sword2', slot: 'weapon', allowedClasses: ['knight'] }).ok, false);
});

test('progression manager produces level-up events', () => {
  const progression = new ProgressionManager();
  const result = progression.addXp(1000);
  assert.ok(result.level > 1);
  assert.equal(result.levelsGained, result.level - 1);
  assert.ok(progression.skillPoints > 0);
});

test('loot generator is reproducible', () => {
  assert.deepEqual(new LootGenerator(99).generate(20, true), new LootGenerator(99).generate(20, true));
});

test('quest manager progresses objectives and claims rewards', () => {
  const quests = new QuestManager([{ id: 'q1', title: 'First', description: '', objectives: [{ id: 'o1', type: 'kill', target: 'slime', required: 2, progress: 0 }], rewards: { gold: 100 } }]);
  assert.equal(quests.accept('q1'), true);
  quests.progress('q1', 'o1', 2);
  assert.deepEqual(quests.claim('q1'), { gold: 100 });
});

test('dungeon generator creates ordered floors and a final boss', () => {
  const dungeon = DungeonGenerator.create('crypt-01', 10, 7);
  assert.equal(dungeon.floors.length, 10);
  assert.equal(dungeon.floors[0].index, 1);
  assert.equal(dungeon.floors[9].bossId, 'boss-crypt-01');
});

test('skill tree enforces prerequisites', () => {
  const manager = new SkillTreeManager({ nodes: [
    { id: 'root', name: 'Root', maxRank: 1, cost: 1, prerequisites: [], effects: {} },
    { id: 'child', name: 'Child', maxRank: 1, cost: 1, prerequisites: ['root'], effects: {} }
  ] });
  manager.grantPoints(2);
  assert.equal(manager.learn('child'), false);
  assert.equal(manager.learn('root'), true);
  assert.equal(manager.learn('child'), true);
});

test('basic combat AI selects a live threat target', () => {
  const decision = new BasicCombatAI().decide({ self: { hp: 50, maxHp: 100 }, targets: [{ id: 'a', hp: 0, threat: 99 }, { id: 'b', hp: 20, threat: 10 }] });
  assert.equal(decision.action, 'attack');
  assert.equal(decision.targetId, 'b');
});

test('save serializer emits and validates versioned envelopes', () => {
  const raw = SaveSerializer.encode({ stage: 3, party: [] });
  const save = SaveSerializer.decode(raw);
  assert.equal(save.data.stage, 3);
  assert.throws(() => SaveSerializer.decode(JSON.stringify({ schemaVersion: 999, data: {} })));
});
