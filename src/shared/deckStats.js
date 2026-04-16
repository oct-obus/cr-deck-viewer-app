// Deck stats computation

export function computeDeckStats(cardIds, cardData) {
  if (!cardIds || cardIds.length === 0) return null;

  // Use 0 for unknown cards so divisor stays at 8
  const elixirs = cardIds.map(id => cardData[id]?.elixir || 0);
  const totalElixir = elixirs.reduce((s, e) => s + e, 0);
  const avgElixir = (totalElixir / cardIds.length).toFixed(1);

  // 4-card cycle stats (only meaningful with a full 8-card deck)
  const sorted = [...elixirs].sort((a, b) => a - b);
  const lowest4 = sorted.slice(0, 4);
  const highest4 = sorted.slice(-4);
  const cycleMin = lowest4.reduce((s, e) => s + e, 0);
  const cycleAvg = (totalElixir / 2).toFixed(1);
  const cycleMax = highest4.reduce((s, e) => s + e, 0);

  return {
    avgElixir,
    cycleMin,
    cycleAvg,
    cycleMax,
  };
}
