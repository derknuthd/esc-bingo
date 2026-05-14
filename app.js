import { ESC_PRESETS } from './presets.js';

const MIN_POOL_SIZE = 24;
const GRID_SIZE = 25;
const FREE_FIELD_INDEX = 12;
const FREE_FIELD_LABEL = '⭐';

// --- State (pool starts full) ---
let pool = [...ESC_PRESETS];
let activePresets = new Set(ESC_PRESETS);
let customFields = [];
let cardCount = 1;
let freeFieldEnabled = true;

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
  const needed = freeFieldEnabled ? MIN_POOL_SIZE : GRID_SIZE;
  const items = shuffle(pool).slice(0, needed);
  if (freeFieldEnabled) {
    items.splice(FREE_FIELD_INDEX, 0, FREE_FIELD_LABEL);
  }
  return items;
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
const btnSelectAll = document.getElementById('btn-select-all');
const btnDeselectAll = document.getElementById('btn-deselect-all');
const btnAddCustom = document.getElementById('btn-add-custom');

const presetContainer = document.getElementById('preset-tags');
const customInput = document.getElementById('custom-input');
const customChips = document.getElementById('custom-chips');
const poolCount = document.getElementById('pool-count');
const poolHint = document.getElementById('pool-hint');
const validationMsg = document.getElementById('validation-msg');

const cardContainer = document.getElementById('card-container');
const cardNameInput = document.getElementById('card-name');
const cardCountInput = document.getElementById('card-count');
const optFreeField = document.getElementById('opt-free-field');

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

// --- Pool status ---
function rebuildPool() {
  pool = [...activePresets, ...customFields];
}

function updateStatus() {
  const n = pool.length;
  const enough = n >= MIN_POOL_SIZE;
  poolCount.textContent = `${n} Felder im Pool`;
  poolCount.classList.toggle('pool-count--ready', enough);
  poolCount.classList.toggle('pool-count--warn', !enough);

  if (!enough) {
    poolHint.textContent = `Mindestens ${MIN_POOL_SIZE} nötig — noch ${MIN_POOL_SIZE - n} fehlen`;
    poolHint.hidden = false;
  } else {
    poolHint.hidden = true;
  }

  btnGenerate.disabled = !enough;
}

// --- Preset tags ---
function renderPresetTags() {
  presetContainer.innerHTML = '';
  ESC_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag tag--active';
    btn.textContent = preset;
    btn.setAttribute('aria-pressed', 'true');
    btn.addEventListener('click', () => togglePreset(preset, btn));
    presetContainer.appendChild(btn);
  });
}

function togglePreset(preset, btn) {
  if (activePresets.has(preset)) {
    activePresets.delete(preset);
    btn.classList.remove('tag--active');
    btn.setAttribute('aria-pressed', 'false');
  } else {
    activePresets.add(preset);
    btn.classList.add('tag--active');
    btn.setAttribute('aria-pressed', 'true');
  }
  rebuildPool();
  updateStatus();
}

function selectAllPresets() {
  activePresets = new Set(ESC_PRESETS);
  presetContainer.querySelectorAll('.tag').forEach(btn => {
    btn.classList.add('tag--active');
    btn.setAttribute('aria-pressed', 'true');
  });
  rebuildPool();
  updateStatus();
}

function deselectAllPresets() {
  activePresets.clear();
  presetContainer.querySelectorAll('.tag').forEach(btn => {
    btn.classList.remove('tag--active');
    btn.setAttribute('aria-pressed', 'false');
  });
  rebuildPool();
  updateStatus();
}

// --- Custom fields ---
function addCustomField(text) {
  const value = text.trim();
  if (!value || pool.includes(value)) return false;
  customFields.push(value);
  rebuildPool();
  updateStatus();
  renderCustomChip(value);
  return true;
}

function removeCustomField(value) {
  customFields = customFields.filter(v => v !== value);
  rebuildPool();
  updateStatus();
  renderAllCustomChips();
}

function renderCustomChip(value) {
  const chip = document.createElement('span');
  chip.className = 'chip';

  const label = document.createElement('span');
  label.textContent = value;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'chip__remove';
  remove.setAttribute('aria-label', `${value} entfernen`);
  remove.textContent = '×';
  remove.addEventListener('click', () => removeCustomField(value));

  chip.appendChild(label);
  chip.appendChild(remove);
  customChips.appendChild(chip);
}

function renderAllCustomChips() {
  customChips.innerHTML = '';
  customFields.forEach(renderCustomChip);
}

// --- Card rendering ---
function renderCards(cards, name) {
  cardContainer.innerHTML = '';
  cards.forEach(fields => {
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
      if (freeFieldEnabled && i === FREE_FIELD_INDEX) {
        cell.classList.add('bingo-cell--free');
      }
      cell.textContent = text;
      grid.appendChild(cell);
    });

    card.appendChild(grid);
    cardContainer.appendChild(card);
  });
}

// --- Event listeners ---
btnStart.addEventListener('click', () => {
  renderPresetTags();
  updateStatus();
  showPhase('phase-2');
});

btnBack.addEventListener('click', () => showPhase('phase-1'));

btnSelectAll.addEventListener('click', selectAllPresets);
btnDeselectAll.addEventListener('click', deselectAllPresets);

btnGenerate.addEventListener('click', () => {
  if (pool.length < MIN_POOL_SIZE) {
    validationMsg.textContent = `Zu wenig Felder — bitte mindestens ${MIN_POOL_SIZE} auswählen.`;
    validationMsg.hidden = false;
    return;
  }
  validationMsg.hidden = true;

  freeFieldEnabled = optFreeField.checked;
  cardCount = Math.max(1, Math.min(20, parseInt(cardCountInput.value, 10) || 1));
  const name = cardNameInput.value.trim();

  const cards = Array.from({ length: cardCount }, () => generateCard());
  renderCards(cards, name);
  showPhase('phase-3');
});

btnNewCard.addEventListener('click', () => {
  const name = cardNameInput.value.trim();
  const newCard = generateCard();
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
  newCard.forEach((text, i) => {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    if (freeFieldEnabled && i === FREE_FIELD_INDEX) cell.classList.add('bingo-cell--free');
    cell.textContent = text;
    grid.appendChild(cell);
  });
  card.appendChild(grid);
  cardContainer.appendChild(card);
});

btnPrint.addEventListener('click', () => window.print());

btnEditFields.addEventListener('click', () => {
  updateStatus();
  showPhase('phase-2');
});

btnAddCustom.addEventListener('click', () => {
  if (addCustomField(customInput.value)) {
    customInput.value = '';
  }
  customInput.focus();
});

customInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (addCustomField(customInput.value)) {
      customInput.value = '';
    }
  }
});

cardCountInput.addEventListener('change', () => {
  const v = parseInt(cardCountInput.value, 10);
  if (isNaN(v) || v < 1) cardCountInput.value = 1;
  if (v > 20) cardCountInput.value = 20;
});
