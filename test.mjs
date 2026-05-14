import assert from 'node:assert/strict';
import {
  shuffle,
  generateCard,
  isPoolValid,
  MIN_POOL_SIZE,
  FREE_FIELD_INDEX,
  FREE_FIELD_LABEL,
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
const MIN_POOL = Array.from({ length: MIN_POOL_SIZE }, (_, i) => `Feld ${i + 1}`);

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

// --- generateCard mit Freifeld ---
console.log('\ngenerateCard (freeField = true)');

test('gibt genau 25 Felder zurück', () => {
  assert.equal(generateCard(POOL, true).length, 25);
});

test(`Freifeld an Index ${FREE_FIELD_INDEX}`, () => {
  assert.equal(generateCard(POOL, true)[FREE_FIELD_INDEX], FREE_FIELD_LABEL);
});

test('alle anderen Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, true).filter(f => f !== FREE_FIELD_LABEL);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const fields = generateCard(POOL, true).filter(f => f !== FREE_FIELD_LABEL);
  assert.equal(new Set(fields).size, fields.length);
});

test('funktioniert mit genau MIN_POOL_SIZE Einträgen', () => {
  const card = generateCard(MIN_POOL, true);
  assert.equal(card.length, 25);
  assert.equal(card[FREE_FIELD_INDEX], FREE_FIELD_LABEL);
});

// --- generateCard ohne Freifeld ---
console.log('\ngenerateCard (freeField = false)');

test('gibt genau 25 Felder zurück', () => {
  assert.equal(generateCard(POOL, false).length, 25);
});

test('kein Freifeld-Symbol enthalten', () => {
  assert.ok(!generateCard(POOL, false).includes(FREE_FIELD_LABEL));
});

test('alle Felder kommen aus dem Pool', () => {
  const card = generateCard(POOL, false);
  assert.ok(card.every(f => POOL.includes(f)));
});

test('keine doppelten Felder', () => {
  const card = generateCard(POOL, false);
  assert.equal(new Set(card).size, card.length);
});

// --- isPoolValid ---
console.log('\nisPoolValid');

test('true bei genau 24 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 24 }, (_, i) => `F${i}`)));
});

test('true bei mehr als 24 Einträgen', () => {
  assert.ok(isPoolValid(Array.from({ length: 45 }, (_, i) => `F${i}`)));
});

test('false bei 23 Einträgen', () => {
  assert.ok(!isPoolValid(Array.from({ length: 23 }, (_, i) => `F${i}`)));
});

test('false bei leerem Pool', () => {
  assert.ok(!isPoolValid([]));
});

// --- Ergebnis ---
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
