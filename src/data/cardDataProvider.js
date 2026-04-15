// Card data provider for React Native
import rawCards from './cards.json';
import cardImages from './cardImages';

// Enrich card data with local image references
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

// Get the local image source for a card at a given deck position
export function getCardImage(card, index) {
  if (!card) return null;
  if (index === 0 && card.localEvoIcon) return card.localEvoIcon;
  if (index === 1 && card.localHeroIcon) return card.localHeroIcon;
  if (index === 2) {
    if (card.localEvoIcon) return card.localEvoIcon;
    if (card.localHeroIcon) return card.localHeroIcon;
  }
  return card.localIcon;
}

// Get card type from ID
export function getCardType(id) {
  if (id.startsWith('27')) return 'building';
  if (id.startsWith('28')) return 'spell';
  return 'troop';
}
