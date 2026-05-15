export const MIN_POOL_SIZE = 24;
export const FREE_FIELD_INDEX = 12;
export const FREE_FIELD_LABEL = '⭐';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateCard(pool, freeFieldEnabled) {
  const needed = freeFieldEnabled ? MIN_POOL_SIZE : 25;
  const items = shuffle(pool).slice(0, needed);
  if (freeFieldEnabled) items.splice(FREE_FIELD_INDEX, 0, FREE_FIELD_LABEL);
  return items;
}

export function isPoolValid(pool) {
  return pool.length >= MIN_POOL_SIZE;
}

export function navigateCards(currentIndex, delta, cardCount) {
  return Math.max(0, Math.min(cardCount - 1, currentIndex + delta));
}
