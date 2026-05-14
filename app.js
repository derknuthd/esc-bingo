import { ESC_PRESETS } from './presets.js';

const MIN_POOL_SIZE = 24;
const GRID_SIZE = 25;
const FREE_FIELD_INDEX = 12;
const FREE_FIELD_LABEL = '⭐';

// --- State ---
let pool = [];
let activePresets = new Set();

// --- Fisher-Yates shuffle ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCard() {
  const items = shuffle(pool).slice(0, MIN_POOL_SIZE);
  const fields = [...items];
  fields.splice(FREE_FIELD_INDEX, 0, FREE_FIELD_LABEL);
  return fields;
}

// --- DOM refs ---
const phase1 = document.getElementById('phase-1');
const phase2 = document.getElementById('phase-2');
const phase3 = document.getElementById('phase-3');

const btnStart = document.getElementById('btn-start');
const btnBack = document.getElementById('btn-back');
const btnGenerate = document.getElementById('btn-generate');
const btnNewCard = document.getElementById('btn-new-card');
const btnPrint = document.getElementById('btn-print');
const btnEditFields = document.getElementById('btn-edit-fields');

const presetContainer = document.getElementById('preset-tags');
const customInput = document.getElementById('custom-input');
const btnAddCustom = document.getElementById('btn-add-custom');
const poolCounter = document.getElementById('pool-counter');
const validationMsg = document.getElementById('validation-msg');
const activeChips = document.getElementById('active-chips');

const cardContainer = document.getElementById('card-container');
const cardName = document.getElementById('card-name');

// --- Phase transitions ---
function showPhase(id) {
  [phase1, phase2, phase3].forEach(p => {
    p.classList.remove('phase--active');
    p.setAttribute('aria-hidden', 'true');
  });
  const target = document.getElementById(id);
  target.classList.add('phase--active');
  target.setAttribute('aria-hidden', 'false');
}

// --- Pool & counter ---
function updateCounter() {
  const n = pool.length;
  poolCounter.textContent = `${n} von mindestens ${MIN_POOL_SIZE} Feldern gewählt`;
  poolCounter.classList.toggle('counter--ready', n >= MIN_POOL_SIZE);
  btnGenerate.disabled = n < MIN_POOL_SIZE;
}

function addToPool(text) {
  const value = text.trim();
  if (!value || pool.includes(value)) return;
  pool.push(value);
  renderActiveChip(value);
  updateCounter();
}

function removeFromPool(value) {
  pool = pool.filter(v => v !== value);
  activePresets.delete(value);
  updatePresetTags();
  renderAllChips();
  updateCounter();
}

// --- Preset tags ---
function renderPresetTags() {
  presetContainer.innerHTML = '';
  ESC_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag';
    btn.textContent = preset;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => togglePreset(preset, btn));
    presetContainer.appendChild(btn);
  });
}

function updatePresetTags() {
  presetContainer.querySelectorAll('.tag').forEach(btn => {
    const active = activePresets.has(btn.textContent);
    btn.classList.toggle('tag--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function togglePreset(preset, btn) {
  if (activePresets.has(preset)) {
    activePresets.delete(preset);
    removeFromPool(preset);
  } else {
    activePresets.add(preset);
    addToPool(preset);
    btn.classList.add('tag--active');
    btn.setAttribute('aria-pressed', 'true');
  }
}

// --- Active chips ---
function renderActiveChip(value) {
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.dataset.value = value;

  const label = document.createElement('span');
  label.textContent = value;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'chip__remove';
  remove.setAttribute('aria-label', `${value} entfernen`);
  remove.textContent = '×';
  remove.addEventListener('click', () => removeFromPool(value));

  chip.appendChild(label);
  chip.appendChild(remove);
  activeChips.appendChild(chip);
}

function renderAllChips() {
  activeChips.innerHTML = '';
  pool.forEach(renderActiveChip);
}

// --- Card rendering ---
function renderCard(fields, name) {
  const existing = cardContainer.querySelector('.bingo-card');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.className = 'bingo-card';

  if (name) {
    const nameEl = document.createElement('div');
    nameEl.className = 'bingo-card__name';
    nameEl.textContent = name;
    card.appendChild(nameEl);
  }

  const grid = document.createElement('div');
  grid.className = 'bingo-grid';

  fields.forEach((text, i) => {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    if (i === FREE_FIELD_INDEX) cell.classList.add('bingo-cell--free');
    cell.textContent = text;
    grid.appendChild(cell);
  });

  card.appendChild(grid);
  cardContainer.prepend(card);
}

// --- Event listeners ---
btnStart.addEventListener('click', () => {
  renderPresetTags();
  updateCounter();
  showPhase('phase-2');
});

btnBack.addEventListener('click', () => showPhase('phase-1'));

btnGenerate.addEventListener('click', () => {
  if (pool.length < MIN_POOL_SIZE) {
    validationMsg.textContent = `Zu wenig Felder gewählt – bitte mindestens ${MIN_POOL_SIZE} auswählen.`;
    validationMsg.hidden = false;
    return;
  }
  validationMsg.hidden = true;
  const fields = generateCard();
  renderCard(fields, cardName.value.trim());
  showPhase('phase-3');
});

btnNewCard.addEventListener('click', () => {
  const fields = generateCard();
  renderCard(fields, cardName.value.trim());
});

btnPrint.addEventListener('click', () => window.print());

btnEditFields.addEventListener('click', () => {
  showPhase('phase-2');
  updateCounter();
});

btnAddCustom.addEventListener('click', () => {
  addToPool(customInput.value);
  customInput.value = '';
  customInput.focus();
});

customInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addToPool(customInput.value);
    customInput.value = '';
  }
});
