import { FREE_FIELD_LABEL, getGridConfig, generateCard, isPoolValid, parsePresetGroups } from './logic.js';

// --- State ---
let ESC_PRESET_GROUPS = [];
let ESC_PRESETS = [];
let pool = [];
let activePresets = new Set();
let customFields = [];
let cardCount = 1;
let cards = [];
let currentCard = 0;
let freeFieldEnabled = true;
let gridSize = 5;
let selectedMode = null;
let uppercaseEnabled = false;

// --- DOM refs ---
const phase1 = document.getElementById('phase-1');
const phase2 = document.getElementById('phase-2');

const btnModeClassic = document.getElementById('btn-mode-classic');
const btnModeKids    = document.getElementById('btn-mode-kids');
const modeError      = document.getElementById('mode-error');
const btnBack        = document.getElementById('btn-back');
const btnGenerate    = document.getElementById('btn-generate');

const btnDecrement   = document.getElementById('btn-decrement');
const btnIncrement   = document.getElementById('btn-increment');
const countDisplay   = document.getElementById('card-count-display');
const cardPreview    = document.getElementById('card-preview');
const printContainer = document.getElementById('print-container');
const cardNav  = document.getElementById('card-nav');
const btnPrev  = document.getElementById('btn-prev');
const btnNext  = document.getElementById('btn-next');

const btnSelectAll    = document.getElementById('btn-select-all');
const btnDeselectAll  = document.getElementById('btn-deselect-all');
const presetContainer = document.getElementById('preset-tags');
const customInput     = document.getElementById('custom-input');
const btnAddCustom    = document.getElementById('btn-add-custom');
const customChips     = document.getElementById('custom-chips');
const optFreeField    = document.getElementById('opt-free-field');
const optUppercase    = document.getElementById('opt-uppercase');
const kidsOptionsSection = document.getElementById('kids-options-section');
const gridSizeInputs  = document.querySelectorAll('.grid-size-radio');
const cardTitle           = document.getElementById('card-title');
const btnToggleCustomizer = document.getElementById('btn-toggle-customizer');
const fieldCustomizer     = document.getElementById('field-customizer');

// --- Phase transitions ---
function showPhase(id) {
  [phase1, phase2].forEach(p => {
    p.classList.remove('phase--active');
    p.setAttribute('aria-hidden', 'true');
  });
  const target = document.getElementById(id);
  target.classList.add('phase--active');
  target.setAttribute('aria-hidden', 'false');
}

// --- Stepper ---
function updateCountDisplay() {
  countDisplay.value = cardCount;
  btnDecrement.disabled = cardCount <= 1;
  btnIncrement.disabled = cardCount >= 20;
}

// --- Pool ---
function rebuildPool() {
  pool = [...activePresets, ...customFields];
  btnGenerate.disabled = !isPoolValid(pool, gridSize);
  generateCards();
}

function setDefaultGridSize(size) {
  gridSize = size;
  gridSizeInputs.forEach(input => { input.checked = parseInt(input.value, 10) === size; });
  const { freeFieldIndex } = getGridConfig(size);
  const freefieldSection = optFreeField.closest('.customizer-section');
  freefieldSection.hidden = freeFieldIndex === null;
  if (freeFieldIndex === null) optFreeField.checked = false;
}

// --- Preset tags ---
function getGroupOpenStates() {
  const states = {};
  presetContainer.querySelectorAll('details.preset-group').forEach(el => {
    const title = el.querySelector('.preset-group__title');
    if (title) states[title.textContent] = el.open;
  });
  return states;
}

function renderPresetTags(openStates = {}) {
  presetContainer.innerHTML = '';
  ESC_PRESET_GROUPS.forEach(({ group, items }) => {
    const details = document.createElement('details');
    details.className = 'preset-group';
    if (openStates[group]) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'preset-group__header';

    const indicator = document.createElement('span');
    indicator.className = 'preset-group__indicator';

    const title = document.createElement('span');
    title.className = 'preset-group__title';
    title.textContent = group;

    const btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'btn btn--ghost btn--sm';
    btnAll.textContent = 'Alle';

    const btnNone = document.createElement('button');
    btnNone.type = 'button';
    btnNone.className = 'btn btn--ghost btn--sm';
    btnNone.textContent = 'Keine';

    summary.appendChild(indicator);
    summary.appendChild(title);
    summary.appendChild(btnAll);
    summary.appendChild(btnNone);
    details.appendChild(summary);

    function updateIndicator() {
      const activeCount = items.filter(p => activePresets.has(p)).length;
      if (activeCount === items.length) {
        indicator.dataset.state = 'all';
        indicator.textContent = '✓';
      } else if (activeCount === 0) {
        indicator.dataset.state = 'none';
        indicator.textContent = '';
      } else {
        indicator.dataset.state = 'partial';
        indicator.textContent = '−';
      }
    }

    btnAll.addEventListener('click', e => {
      e.stopPropagation();
      items.forEach(p => activePresets.add(p));
      details.querySelectorAll('.preset-item').forEach(btn => {
        btn.classList.add('preset-item--active');
        btn.setAttribute('aria-pressed', 'true');
      });
      updateIndicator();
      rebuildPool();
    });

    btnNone.addEventListener('click', e => {
      e.stopPropagation();
      items.forEach(p => activePresets.delete(p));
      details.querySelectorAll('.preset-item').forEach(btn => {
        btn.classList.remove('preset-item--active');
        btn.setAttribute('aria-pressed', 'false');
      });
      updateIndicator();
      rebuildPool();
    });

    items.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = activePresets.has(preset);
      btn.className = isActive ? 'preset-item preset-item--active' : 'preset-item';
      btn.textContent = preset;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.addEventListener('click', () => {
        if (activePresets.has(preset)) {
          activePresets.delete(preset);
          btn.classList.remove('preset-item--active');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          activePresets.add(preset);
          btn.classList.add('preset-item--active');
          btn.setAttribute('aria-pressed', 'true');
        }
        updateIndicator();
        rebuildPool();
      });
      details.appendChild(btn);
    });

    updateIndicator();
    presetContainer.appendChild(details);
  });
}

function selectAllPresets() {
  const openStates = getGroupOpenStates();
  activePresets = new Set(ESC_PRESETS);
  renderPresetTags(openStates);
  rebuildPool();
}

function deselectAllPresets() {
  const openStates = getGroupOpenStates();
  activePresets.clear();
  renderPresetTags(openStates);
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
function buildCard(fields, size = gridSize) {
  const card = document.createElement('div');
  card.className = 'bingo-card';

  const titleEl = document.createElement('div');
  titleEl.className = 'bingo-card__title';
  titleEl.textContent = cardTitle.textContent;
  card.appendChild(titleEl);

  const grid = document.createElement('div');
  grid.className = selectedMode === 'presets-kids.txt' ? 'bingo-grid bingo-grid--kids' : 'bingo-grid';
  grid.style.setProperty('--grid-size', size);

  fields.forEach(text => {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    if (text === FREE_FIELD_LABEL) cell.classList.add('bingo-cell--free');
    cell.textContent = (uppercaseEnabled && text !== FREE_FIELD_LABEL) ? text.toUpperCase() : text;
    grid.appendChild(cell);
  });

  card.appendChild(grid);
  return card;
}

// --- Card preview (Phase 2) ---
function generateCards() {
  if (!isPoolValid(pool, gridSize)) {
    cardPreview.querySelector('.bingo-card')?.remove();
    cardPreview.querySelector('.card-preview__empty')?.remove();
    const msg = document.createElement('p');
    msg.className = 'card-preview__empty';
    msg.textContent = 'Zu wenig Felder ausgewählt für eine Vorschau.';
    cardPreview.appendChild(msg);
    cardNav.hidden = true;
    cards = [];
    return;
  }
  cards = Array.from({ length: cardCount }, () =>
    generateCard(pool, freeFieldEnabled, gridSize)
  );
  currentCard = 0;
  showCard(0, 'right');
}

function showCard(index, direction = 'right') {
  const card = buildCard(cards[index], gridSize);
  card.classList.add('bingo-card--active');
  card.dataset.slide = direction;
  cardPreview.querySelector('.bingo-card')?.remove();
  cardPreview.querySelector('.card-preview__empty')?.remove();
  cardPreview.appendChild(card);

  const multi = cards.length > 1;
  cardNav.hidden = !multi;
  if (multi) {
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === cards.length - 1;
  }
}

// --- Print ---
function renderPrintCards() {
  printContainer.innerHTML = '';
  cards.forEach(fields => printContainer.appendChild(buildCard(fields, gridSize)));
}

// --- Mode selection ---
const presetCache = {};

async function loadPresets(filename) {
  if (!presetCache[filename]) {
    const res = await fetch(`./${filename}`);
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    presetCache[filename] = parsePresetGroups(text);
  }
  ESC_PRESET_GROUPS = presetCache[filename];
  ESC_PRESETS = ESC_PRESET_GROUPS.flatMap(g => g.items);
  pool = [...ESC_PRESETS];
  activePresets = new Set(ESC_PRESETS);
  customFields = [];
  rebuildPool();
}

async function selectMode(filename, defaultSize) {
  modeError.hidden = true;
  btnModeClassic.disabled = true;
  btnModeKids.disabled = true;
  try {
    selectedMode = filename;
    setDefaultGridSize(defaultSize);
    const isKids = filename === 'presets-kids.txt';
    kidsOptionsSection.hidden = !isKids;
    uppercaseEnabled = isKids;
    optUppercase.checked = isKids;
    await loadPresets(filename);
    renderPresetTags();
    updateCountDisplay();
    showPhase('phase-2');
  } catch {
    modeError.hidden = false;
  } finally {
    btnModeClassic.disabled = false;
    btnModeKids.disabled = false;
  }
}

// --- Event listeners ---
btnModeClassic.addEventListener('click', () => {
  btnModeClassic.classList.add('mode-card--active');
  btnModeKids.classList.remove('mode-card--active');
  selectMode('presets.txt', 5);
});

btnModeKids.addEventListener('click', () => {
  btnModeKids.classList.add('mode-card--active');
  btnModeClassic.classList.remove('mode-card--active');
  selectMode('presets-kids.txt', 4);
});

btnBack.addEventListener('click', () => {
  showPhase('phase-1');
  fieldCustomizer.classList.remove('customizer--open');
  btnToggleCustomizer.setAttribute('aria-expanded', 'false');
});

btnDecrement.addEventListener('click', () => {
  cardCount = Math.max(1, cardCount - 1);
  updateCountDisplay();
  generateCards();
});

btnIncrement.addEventListener('click', () => {
  cardCount = Math.min(20, cardCount + 1);
  updateCountDisplay();
  generateCards();
});

countDisplay.addEventListener('change', () => {
  const val = parseInt(countDisplay.value, 10);
  cardCount = Math.max(1, Math.min(20, isNaN(val) ? 1 : val));
  updateCountDisplay();
  generateCards();
});

btnPrev.addEventListener('click', () => {
  if (currentCard > 0) showCard(--currentCard, 'left');
});

btnNext.addEventListener('click', () => {
  if (currentCard < cards.length - 1) showCard(++currentCard, 'right');
});

document.addEventListener('keydown', e => {
  if (document.activeElement?.tagName === 'INPUT') return;
  if (e.key === 'ArrowLeft' && currentCard > 0) showCard(--currentCard, 'left');
  if (e.key === 'ArrowRight' && currentCard < cards.length - 1) showCard(++currentCard, 'right');
});

btnGenerate.addEventListener('click', () => {
  freeFieldEnabled = optFreeField.checked;
  renderPrintCards();
  window.print();
});

gridSizeInputs.forEach(input => input.addEventListener('change', () => {
  gridSize = parseInt(input.value, 10);
  const { freeFieldIndex } = getGridConfig(gridSize);
  const freefieldSection = optFreeField.closest('.customizer-section');
  freefieldSection.hidden = freeFieldIndex === null;
  if (freeFieldIndex === null) optFreeField.checked = false;
  rebuildPool();
}));

optFreeField.addEventListener('change', () => {
  freeFieldEnabled = optFreeField.checked;
  generateCards();
});

optUppercase.addEventListener('change', () => {
  uppercaseEnabled = optUppercase.checked;
  generateCards();
});

btnToggleCustomizer?.addEventListener('click', () => {
  const isOpen = fieldCustomizer.classList.toggle('customizer--open');
  btnToggleCustomizer.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) fieldCustomizer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

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
