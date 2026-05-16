import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  shuffle,
  generateCard,
  isPoolValid,
  navigateCards,
  getGridConfig,
  GRID_CONFIGS,
  FREE_FIELD_LABEL,
  parsePresetGroups,
} from './logic.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${e.message}`);
    failed++;
  }
}

const POOL = Array.from({ length: 30 }, (_, i) => `Feld ${i + 1}`);
const POOL_5x5 = Array.from({ length: getGridConfig(5).minPool }, (_, i) => `Feld ${i + 1}`);
const POOL_4x4 = Array.from({ length: getGridConfig(4).minPool }, (_, i) => `Feld ${i + 1}`);
const POOL_3x3 = Array.from({ length: getGridConfig(3).minPool }, (_, i) => `Feld ${i + 1}`);

// --- shuffle ---
console.log('\nshuffle');

test('gibt Array gleicher Länge zurück', () => {
  assert.equal(shuffle(POOL).length, POOL.length);
});

test('enthält dieselben Elemente', () => {
  const result = shuffle(POOL);
  assert.deepEqual([...result].sort(), [...POOL].sort());
});

test('mutiert das Original nicht', () => {
  const arr = [1, 2, 3];
  const copy = [...arr];
  shuffle(arr);
  assert.deepEqual(arr, copy);
});

test('erzeugt unterschiedliche Reihenfolgen', () => {
  const results = new Set(Array.from({ length: 20 }, () => shuffle(POOL).join(',')));
  assert.ok(results.size > 1, 'Alle 20 Shuffles identisch — Zufall defekt');
});

// --- getGridConfig ---
console.log('\ngetGridConfig');

test('liefert korrekte Werte für 3×3', () => {
  const cfg = getGridConfig(3);
  assert.equal(cfg.size, 3);
  assert.equal(cfg.totalCells, 9);
  assert.equal(cfg.minPool, 8);
  assert.equal(cfg.freeFieldIndex, 4);
});

test('liefert korrekte Werte für 4×4', () => {
  const cfg = getGridConfig(4);
  assert.equal(cfg.size, 4);
  assert.equal(cfg.totalCells, 16);
  assert.equal(cfg.minPool, 16);
  assert.equal(cfg.freeFieldIndex, null);
});

test('liefert korrekte Werte für 5×5', () => {
  const cfg = getGridConfig(5);
  assert.equal(cfg.size, 5);
  assert.equal(cfg.totalCells, 25);
  assert.equal(cfg.minPool, 24);
  assert.equal(cfg.freeFieldIndex, 12);
});

test('fällt auf 5×5 zurück bei unbekannter Größe', () => {
  assert.deepEqual(getGridConfig(99), GRID_CONFIGS[5]);
  assert.deepEqual(getGridConfig(0), GRID_CONFIGS[5]);
});

// --- generateCard 5×5 mit Freifeld ---
console.log('\ngenerateCard 5×5 (freeField = true)');

const FREE_IDX_5 = getGridConfig(5).freeFieldIndex;

test('gibt genau 25 Felder zurück', () => {
  assert.equal(generateCard(POOL, true, 5).length, 25);
});

test(`Freifeld an Index ${FREE_IDX_5}`, () => {
  assert.equal(generateCard(POOL, true, 5)[FREE_IDX_5], FREE_FIELD_LABEL);
});

test('alle anderen Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, true, 5).filter(f => f !== FREE_FIELD_LABEL);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const fields = generateCard(POOL, true, 5).filter(f => f !== FREE_FIELD_LABEL);
  assert.equal(new Set(fields).size, fields.length);
});

test('funktioniert mit genau minPool Einträgen', () => {
  const card = generateCard(POOL_5x5, true, 5);
  assert.equal(card.length, 25);
  assert.equal(card[FREE_IDX_5], FREE_FIELD_LABEL);
});

// --- generateCard 5×5 ohne Freifeld ---
console.log('\ngenerateCard 5×5 (freeField = false)');

test('gibt genau 25 Felder zurück', () => {
  assert.equal(generateCard(POOL, false, 5).length, 25);
});

test('kein Freifeld-Symbol enthalten', () => {
  assert.ok(!generateCard(POOL, false, 5).includes(FREE_FIELD_LABEL));
});

test('alle Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, false, 5);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const card = generateCard(POOL, false, 5);
  assert.equal(new Set(card).size, card.length);
});

// --- generateCard 3×3 ---
console.log('\ngenerateCard 3×3');

const FREE_IDX_3 = getGridConfig(3).freeFieldIndex;

test('gibt genau 9 Felder zurück', () => {
  assert.equal(generateCard(POOL, true, 3).length, 9);
});

test(`Freifeld an Index ${FREE_IDX_3}`, () => {
  assert.equal(generateCard(POOL, true, 3)[FREE_IDX_3], FREE_FIELD_LABEL);
});

test('alle anderen Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, true, 3).filter(f => f !== FREE_FIELD_LABEL);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const fields = generateCard(POOL, true, 3).filter(f => f !== FREE_FIELD_LABEL);
  assert.equal(new Set(fields).size, fields.length);
});

test('funktioniert mit genau minPool Einträgen', () => {
  const card = generateCard(POOL_3x3, true, 3);
  assert.equal(card.length, 9);
  assert.equal(card[FREE_IDX_3], FREE_FIELD_LABEL);
});

// --- generateCard 4×4 ---
console.log('\ngenerateCard 4×4');

test('gibt genau 16 Felder zurück', () => {
  assert.equal(generateCard(POOL, true, 4).length, 16);
});

test('kein Freifeld-Symbol auch wenn freeField = true (kein Mittelfeld)', () => {
  assert.ok(!generateCard(POOL, true, 4).includes(FREE_FIELD_LABEL));
});

test('kein Freifeld-Symbol wenn freeField = false', () => {
  assert.ok(!generateCard(POOL, false, 4).includes(FREE_FIELD_LABEL));
});

test('alle Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, true, 4);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const card = generateCard(POOL, true, 4);
  assert.equal(new Set(card).size, card.length);
});

test('funktioniert mit genau minPool Einträgen', () => {
  const card = generateCard(POOL_4x4, true, 4);
  assert.equal(card.length, 16);
});

// --- isPoolValid ---
console.log('\nisPoolValid');

test('5×5: true bei genau 24 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 24 }, (_, i) => `F${i}`), 5));
});

test('5×5: true bei mehr als 24 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 45 }, (_, i) => `F${i}`), 5));
});

test('5×5: false bei 23 Einträgen', () => {
  assert.ok(!isPoolValid(Array.from({ length: 23 }, (_, i) => `F${i}`), 5));
});

test('5×5: false bei leerem Pool', () => {
  assert.ok(!isPoolValid([], 5));
});

test('4×4: true bei genau 16 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 16 }, (_, i) => `F${i}`), 4));
});

test('4×4: false bei 15 Einträgen', () => {
  assert.ok(!isPoolValid(Array.from({ length: 15 }, (_, i) => `F${i}`), 4));
});

test('3×3: true bei genau 8 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 8 }, (_, i) => `F${i}`), 3));
});

test('3×3: false bei 7 Einträgen', () => {
  assert.ok(!isPoolValid(Array.from({ length: 7 }, (_, i) => `F${i}`), 3));
});

test('nutzt gridSize 5 als Default', () => {
  assert.ok(isPoolValid(Array.from({ length: 24 }, (_, i) => `F${i}`)));
  assert.ok(!isPoolValid(Array.from({ length: 23 }, (_, i) => `F${i}`)));
});

// --- navigateCards ---
console.log('\nnavigateCards');

test('vorwärts innerhalb der Grenzen', () => {
  assert.equal(navigateCards(2, 1, 5), 3);
});

test('rückwärts innerhalb der Grenzen', () => {
  assert.equal(navigateCards(2, -1, 5), 1);
});

test('nicht unter 0 (Anfang)', () => {
  assert.equal(navigateCards(0, -1, 5), 0);
});

test('nicht über cardCount - 1 (Ende)', () => {
  assert.equal(navigateCards(4, 1, 5), 4);
});

test('großer negativer Delta wird auf 0 geclampt', () => {
  assert.equal(navigateCards(1, -99, 5), 0);
});

test('großer positiver Delta wird auf cardCount - 1 geclampt', () => {
  assert.equal(navigateCards(3, 99, 5), 4);
});

test('einzelne Karte bleibt bei Index 0', () => {
  assert.equal(navigateCards(0, 1, 1), 0);
  assert.equal(navigateCards(0, -1, 1), 0);
});

// --- presets.txt ---
console.log('\npresets.txt');

const presetsTxt = readFileSync('./presets.txt', 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('#'));

test('hat mindestens 40 Einträge', () => {
  assert.ok(presetsTxt.length >= 40, `Nur ${presetsTxt.length} Einträge`);
});

test('alle Einträge sind nicht-leere Strings', () => {
  assert.ok(presetsTxt.every(p => p.length > 0));
});

test('keine Duplikate', () => {
  assert.equal(new Set(presetsTxt).size, presetsTxt.length);
});

// --- presets-kids.txt ---
console.log('\npresets-kids.txt');

const presetsKidsTxt = readFileSync('./presets-kids.txt', 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('#'));

test('hat mindestens 24 Einträge', () => {
  assert.ok(presetsKidsTxt.length >= 24, `Nur ${presetsKidsTxt.length} Einträge`);
});

test('ist kompatibel mit 4×4 (≥ 16 Einträge)', () => {
  assert.ok(presetsKidsTxt.length >= getGridConfig(4).minPool);
});

test('alle Einträge enthalten mindestens ein Emoji', () => {
  assert.ok(presetsKidsTxt.every(p => /\p{Emoji}/u.test(p)), 'Einträge ohne Emoji gefunden');
});

test('alle Einträge sind nicht-leere Strings', () => {
  assert.ok(presetsKidsTxt.every(p => p.length > 0));
});

test('keine Duplikate', () => {
  assert.equal(new Set(presetsKidsTxt).size, presetsKidsTxt.length);
});

// --- parsePresetGroups ---
console.log('\nparsePresetGroups');

test('gibt leeres Array für leeren Text zurück', () => {
  assert.deepEqual(parsePresetGroups(''), []);
});

test('gibt leeres Array zurück wenn keine Gruppen vorhanden', () => {
  assert.deepEqual(parsePresetGroups('Zeile ohne Gruppe\nNoch eine'), []);
});

test('parst eine Gruppe korrekt', () => {
  const result = parsePresetGroups('# Gruppe A\nItem 1\nItem 2');
  assert.equal(result.length, 1);
  assert.equal(result[0].group, 'Gruppe A');
  assert.deepEqual(result[0].items, ['Item 1', 'Item 2']);
});

test('parst mehrere Gruppen', () => {
  const result = parsePresetGroups('# A\nA1\n# B\nB1\nB2');
  assert.equal(result.length, 2);
  assert.equal(result[0].group, 'A');
  assert.deepEqual(result[1].items, ['B1', 'B2']);
});

test('ignoriert Leerzeilen und Zeilen vor der ersten Gruppe', () => {
  const result = parsePresetGroups('ignoriert\n\n# Gruppe\n\nItem');
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].items, ['Item']);
});

test('presets.txt: hat mindestens 5 Gruppen', () => {
  const text = readFileSync('./presets.txt', 'utf8');
  const groups = parsePresetGroups(text);
  assert.ok(groups.length >= 5, `Nur ${groups.length} Gruppen gefunden`);
});

test('presets-kids.txt: hat mindestens 3 Gruppen', () => {
  const text = readFileSync('./presets-kids.txt', 'utf8');
  const groups = parsePresetGroups(text);
  assert.ok(groups.length >= 3, `Nur ${groups.length} Gruppen gefunden`);
});

// --- Ergebnis ---
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
