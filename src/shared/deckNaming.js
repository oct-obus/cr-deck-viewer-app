import { CARD_ABBREVS, OMIT_FROM_NAME, CYCLE_CARDS, BAIT_CARDS } from './constants.js';
import { resolveSlotType } from './slotUtils.js';

export function generateDeckName(cardIds, cardData) {
  if (!cardIds || cardIds.length !== 8) return 'CR Deck';

  const cards = cardIds.map((id, i) => ({
    id,
    name: cardData[id]?.name || id,
    elixir: cardData[id]?.elixir || 0,
    isWinCon: !!cardData[id]?.isWinCondition,
    ...resolveSlotType(cardData[id], i),
  }));

  const totalElixir = cards.reduce((s, c) => s + c.elixir, 0);
  const avgElixirNum = totalElixir / 8;
  const avgElixir = avgElixirNum.toFixed(1);

  function displayName(card) {
    let base = CARD_ABBREVS[card.id] || card.name;
    if (card.isEvo) return 'Evo' + base;
    if (card.isHero) return 'Hero' + base;
    return base;
  }

  const winCons = cards.filter(c => c.isWinCon);
  const supports = cards
    .filter(c => !c.isWinCon && !OMIT_FROM_NAME.has(c.id))
    .sort((a, b) => b.elixir - a.elixir);

  const cycleCount = cards.filter(c => CYCLE_CARDS.has(c.id)).length;
  const baitCount = cards.filter(c => BAIT_CARDS.has(c.id)).length;
  let archetype = '';
  if (baitCount >= 3) archetype = 'Bait';
  else if (cycleCount >= 3 && avgElixirNum <= 3.3) archetype = 'Cycle';
  else if (avgElixirNum >= 4.2) archetype = 'Beatdown';
  else if (avgElixirNum <= 2.9) archetype = 'Cycle';

  const parts = [];

  if (winCons.length > 0) {
    for (const wc of winCons) {
      parts.push(displayName(wc));
    }
  }

  const maxSupports = winCons.length >= 2 ? 1 : 2;
  for (let i = 0; i < Math.min(maxSupports, supports.length); i++) {
    parts.push(displayName(supports[i]));
  }

  if (archetype === 'Cycle' && winCons.length > 0) {
    parts.push(avgElixir);
  }

  if (archetype) {
    parts.push(archetype);
  }

  return parts.length > 0 ? parts.join(' ') : 'CR Deck';
}
