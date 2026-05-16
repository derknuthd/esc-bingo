export const FREE_FIELD_LABEL = '⭐';

export const GRID_CONFIGS = {
  3: { size: 3, totalCells: 9,  minPool: 8,  freeFieldIndex: 4  },
  4: { size: 4, totalCells: 16, minPool: 16, freeFieldIndex: null },
  5: { size: 5, totalCells: 25, minPool: 24, freeFieldIndex: 12 },
};

export function getGridConfig(gridSize) {
  return GRID_CONFIGS[gridSize] ?? GRID_CONFIGS[5];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateCard(pool, freeFieldEnabled, gridSize = 5) {
  const { totalCells, freeFieldIndex } = getGridConfig(gridSize);
  const useFree = freeFieldEnabled && freeFieldIndex !== null;
  const needed = useFree ? totalCells - 1 : totalCells;
  const items = shuffle(pool).slice(0, needed);
  if (useFree) items.splice(freeFieldIndex, 0, FREE_FIELD_LABEL);
  return items;
}

export function isPoolValid(pool, gridSize = 5) {
  return pool.length >= getGridConfig(gridSize).minPool;
}

export function navigateCards(currentIndex, delta, cardCount) {
  return Math.max(0, Math.min(cardCount - 1, currentIndex + delta));
}
