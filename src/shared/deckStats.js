// Deck stats computation

export function computeDeckStats(cardIds, cardData) {
  if (!cardIds || cardIds.length === 0) return null;

  const knownElixirs = cardIds
    .map(id => cardData[id]?.elixir)
    .filter(e => e != null);

  const unknownCount = cardIds.length - knownElixirs.length;
  const knownCount = knownElixirs.length;

  if (knownCount === 0) return { unknownCount };

  const totalElixir = knownElixirs.reduce((s, e) => s + e, 0);
  const avgElixir = (totalElixir / knownCount).toFixed(1);

  // 4-card cycle stats — only meaningful with a full 8-card deck
  let cycleMin = null, cycleAvg = null, cycleMax = null;
  if (unknownCount === 0) {
    const sorted = [...knownElixirs].sort((a, b) => a - b);
    cycleMin = sorted.slice(0, 4).reduce((s, e) => s + e, 0);
    cycleAvg = (totalElixir / 2).toFixed(1);
    cycleMax = sorted.slice(-4).reduce((s, e) => s + e, 0);
  }

  return {
    avgElixir,
    cycleMin,
    cycleAvg,
    cycleMax,
    unknownCount,
  };
}
