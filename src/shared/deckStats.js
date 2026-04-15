// Deck stats computation
import { getCardType } from '../data/cardDataProvider';

export function computeDeckStats(cardIds, cardData) {
  if (!cardIds || cardIds.length === 0) return null;

  const cards = cardIds.map(id => cardData[id]).filter(Boolean);
  const elixirs = cards.map(c => c.elixir || 0);
  const totalElixir = elixirs.reduce((s, e) => s + e, 0);
  const avgElixir = cards.length > 0 ? (totalElixir / cards.length).toFixed(1) : '0.0';

  // 4-card cycle stats
  const sorted = [...elixirs].sort((a, b) => a - b);
  const lowest4 = sorted.slice(0, 4);
  const highest4 = sorted.slice(-4);
  const cycleMin = lowest4.reduce((s, e) => s + e, 0);
  const cycleAvg = (totalElixir / 2).toFixed(1);
  const cycleMax = highest4.reduce((s, e) => s + e, 0);

  // Type counts
  let troops = 0, buildings = 0, spells = 0;
  for (const id of cardIds) {
    const type = getCardType(id);
    if (type === 'building') buildings++;
    else if (type === 'spell') spells++;
    else troops++;
  }

  return {
    avgElixir,
    cycleMin,
    cycleAvg,
    cycleMax,
    troops,
    buildings,
    spells,
    cardCount: cards.length,
  };
}
