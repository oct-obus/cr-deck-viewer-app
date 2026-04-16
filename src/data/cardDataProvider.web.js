// Card data provider for web (CDN URLs instead of require())
import rawCards from './cards.json';
import { resolveCardImageKey } from '../shared/slotUtils.js';

const cardData = {};
for (const [id, card] of Object.entries(rawCards)) {
  cardData[id] = { ...card };
}

export default cardData;

export function getCardImage(card, index) {
  if (!card) return null;
  const key = resolveCardImageKey(card, index);
  const url = card[key] || card.icon;
  return { uri: url };
}
