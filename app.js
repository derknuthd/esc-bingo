import { FREE_FIELD_LABEL, getGridConfig, generateCard, isPoolValid, navigateCards } from './logic.js';

// --- State ---
let ESC_PRESETS = [];
let pool = [];
let activePresets = new Set();
let customFields = [];
let cardCount = 1;
let freeFieldEnabled = true;
let gridSize = 5;
let cards = [];
let activeCardIndex = 0;
let sessionPool = [];
let sessionFreeField = true;
let sessionGridSize = 5;

// --- DOM refs ---
const phase1 = document.getElementById('phase-1');
const phase2 = document.getElementById('phase-2');
const phase3 = document.getElementById('phase-3');

const btnStart     = document.getElementById('btn-start');
const btnBack      = document.getElementById('btn-back');
const btnGenerate  = document.getElementById('btn-generate');
const btnNewCard   = document.getElementById('btn-new-card');
const btnPrint     = document.getElementById('btn-print');
const btnPrev      = document.getElementById('btn-prev');
const btnNext      = document.getElementById('btn-next');
const cardNavCounter = document.getElementById('card-nav-counter');

const btnDecrement    = document.getElementById('btn-decrement');
const btnIncrement    = document.getElementById('btn-increment');
const countDisplay    = document.getElementById('card-count-display');

const btnSelectAll    = document.getElementById('btn-select-all');
const btnDeselectAll  = document.getElementById('btn-deselect-all');
const presetContainer = document.getElementById('preset-tags');
const customInput     = document.getElementById('custom-input');
const btnAddCustom    = document.getElementById('btn-add-custom');
const customChips     = document.getElementById('custom-chips');
const optFreeField    = document.getElementById('opt-free-field');
const gridSizeInputs  = document.querySelectorAll('.grid-size-radio');
const cardContainer   = document.getElementById('card-container');
const cardTitle       = document.getElementById('card-title');

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

// --- Stepper ---
function updateCountDisplay() {
  countDisplay.textContent = cardCount;
  btnDecrement.disabled = cardCount <= 1;
  btnIncrement.disabled = cardCount >= 20;
}

// --- Pool ---
function rebuildPool() {
  pool = [...activePresets, ...customFields];
  btnGenerate.disabled = !isPoolValid(pool, gridSize);
}

// --- Preset tags ---
function renderPresetTags() {
  presetContainer.innerHTML = '';
  ESC_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = activePresets.has(preset);
    btn.className = isActive ? 'tag tag--active' : 'tag';
    btn.textContent = preset;
    btn.setAttribute('aria-pressed', String(isActive));
    btn.addEventListener('click', () => {
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
    });
    presetContainer.appendChild(btn);
  });
}

function selectAllPresets() {
  activePresets = new Set(ESC_PRESETS);
  presetContainer.querySelectorAll('.tag').forEach(btn => {
    btn.classList.add('tag--active');
    btn.setAttribute('aria-pressed', 'true');
  });
  rebuildPool();
}

function deselectAllPresets() {
  activePresets.clear();
  presetContainer.querySelectorAll('.tag').forEach(btn => {
    btn.classList.remove('tag--active');
    btn.setAttribute('aria-pressed', 'false');
  });
  rebuildPool();
}

// --- Custom fields ---
function addCustomField(text) {
  const value = text.trim();
  if (!value || pool.includes(value)) return false;
  customFields.push(value);
  rebuildPool();
  renderCustomChip(value);
  return true;
}

function removeCustomField(value) {
  customFields = customFields.filter(v => v !== value);
  rebuildPool();
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
function buildCard(fields) {
  const card = document.createElement('div');
  card.className = 'bingo-card';

  const titleEl = document.createElement('div');
  titleEl.className = 'bingo-card__title';
  titleEl.textContent = cardTitle.textContent;
  card.appendChild(titleEl);

  const grid = document.createElement('div');
  grid.className = 'bingo-grid';

  grid.style.setProperty('--grid-size', sessionGridSize);

  fields.forEach(text => {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    if (text === FREE_FIELD_LABEL) cell.classList.add('bingo-cell--free');
    cell.textContent = text;
    grid.appendChild(cell);
  });

  card.appendChild(grid);
  return card;
}

function showCard(index) {
  if (index < 0 || index >= cards.length) return;
  activeCardIndex = index;
  cardContainer.querySelectorAll('.bingo-card').forEach((el, i) => {
    el.classList.toggle('bingo-card--active', i === index);
  });
  cardNavCounter.textContent = `Karte ${index + 1} von ${cards.length}`;
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === cards.length - 1;
}

function renderCards(newCards) {
  cards = newCards;
  sessionPool = [...pool];
  sessionFreeField = freeFieldEnabled;
  sessionGridSize = gridSize;
  cardContainer.innerHTML = '';
  cards.forEach(fields => cardContainer.appendChild(buildCard(fields)));
  showCard(0);
}

// --- Event listeners ---
btnStart.addEventListener('click', () => {
  renderPresetTags();
  updateCountDisplay();
  rebuildPool();
  showPhase('phase-2');
});

btnBack.addEventListener('click', () => showPhase('phase-1'));

btnDecrement.addEventListener('click', () => {
  cardCount = Math.max(1, cardCount - 1);
  updateCountDisplay();
});

btnIncrement.addEventListener('click', () => {
  cardCount = Math.min(20, cardCount + 1);
  updateCountDisplay();
});

btnGenerate.addEventListener('click', () => {
  freeFieldEnabled = optFreeField.checked;
  renderCards(Array.from({ length: cardCount }, () => generateCard(pool, freeFieldEnabled, gridSize)));
  showPhase('phase-3');
});

btnNewCard.addEventListener('click', () => {
  cards.push(generateCard(sessionPool, sessionFreeField, sessionGridSize));
  cardContainer.appendChild(buildCard(cards[cards.length - 1]));
  showCard(cards.length - 1);
});

gridSizeInputs.forEach(input => input.addEventListener('change', () => {
  gridSize = parseInt(input.value, 10);
  const { freeFieldIndex } = getGridConfig(gridSize);
  const freefieldSection = optFreeField.closest('.customizer-section');
  freefieldSection.hidden = freeFieldIndex === null;
  if (freeFieldIndex === null) optFreeField.checked = false;
  rebuildPool();
}));

btnPrev.addEventListener('click', () => showCard(activeCardIndex - 1));
btnNext.addEventListener('click', () => showCard(activeCardIndex + 1));

btnPrint.addEventListener('click', () => window.print());

// --- Card title (contenteditable) ---
let titleSnapshot = '';

cardTitle.addEventListener('focus', () => {
  titleSnapshot = cardTitle.textContent;
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(cardTitle);
  sel.removeAllRanges();
  sel.addRange(range);
});

cardTitle.addEventListener('blur', () => {
  const trimmed = cardTitle.textContent.trim();
  cardTitle.textContent = trimmed || 'ESC-Bingo';
  document.querySelectorAll('.bingo-card__title').forEach(el => {
    el.textContent = cardTitle.textContent;
  });
});

cardTitle.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); cardTitle.blur(); }
  if (e.key === 'Escape') { cardTitle.textContent = titleSnapshot; cardTitle.blur(); }
});

cardTitle.addEventListener('paste', e => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain').replace(/[\r\n]+/g, ' ').trim();
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  sel.deleteFromDocument();
  sel.getRangeAt(0).insertNode(document.createTextNode(text));
  sel.collapseToEnd();
});

// Swipe support
let touchStartX = 0;
cardContainer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
cardContainer.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) showCard(navigateCards(activeCardIndex, delta < 0 ? 1 : -1, cards.length));
}, { passive: true });

btnSelectAll.addEventListener('click', selectAllPresets);
btnDeselectAll.addEventListener('click', deselectAllPresets);

btnAddCustom.addEventListener('click', () => {
  if (addCustomField(customInput.value)) customInput.value = '';
  customInput.focus();
});

customInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (addCustomField(customInput.value)) customInput.value = '';
  }
});

// --- Preset loading ---
btnStart.disabled = true;

async function loadPresets() {
  try {
    const res = await fetch('./presets.txt');
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    ESC_PRESETS = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#'));
    pool = [...ESC_PRESETS];
    activePresets = new Set(ESC_PRESETS);
    rebuildPool();
  } catch (e) {
    console.error('Presets konnten nicht geladen werden:', e);
  } finally {
    btnStart.disabled = false;
  }
}

loadPresets();
