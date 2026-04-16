// Card data provider for React Native
import rawCards from './cards.json';
import cardImages from './cardImages';
import { resolveCardImageKey } from '../shared/slotUtils.js';

const cardData = {};
for (const [id, card] of Object.entries(rawCards)) {
  const images = cardImages[id] || {};
  cardData[id] = {
    ...card,
    localIcon: images.icon,
    localEvoIcon: images.evoIcon || null,
    localHeroIcon: images.heroIcon || null,
  };
}

export default cardData;

export function getCardImage(card, index) {
  if (!card) return null;
  const key = resolveCardImageKey(card, index);
  const localKey = 'local' + key.charAt(0).toUpperCase() + key.slice(1);
  return card[localKey] || card.localIcon;
}
