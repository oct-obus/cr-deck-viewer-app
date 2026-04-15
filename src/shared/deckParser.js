// Deck input parsing — shared between web and React Native
// Platform-independent: no DOM dependencies
import { encodeDeck, decodeDeck } from './deckUrl.js';

// Parse a deck string into { cardIds, towerTroop, slots }
// Returns null if parsing fails, with an error message
export function parseDeckString(input) {
  if (!input || typeof input !== 'string') {
    return { error: 'Please paste a deck share link.' };
  }

  input = input.trim();
  let cardIds, towerTroop = null, slots = [];

  // Try compact format first: d=<base62>
  const compactMatch = input.match(/(?:^|[?&#])d=([A-Za-z0-9]+)/);
  if (compactMatch) {
    const decoded = decodeDeck(compactMatch[1]);
    if (decoded) {
      cardIds = decoded.cardIds;
      towerTroop = decoded.towerTroop;
    }
  }

  // Fall back to old format: deck=ID;ID;...
  if (!cardIds) {
    const deckMatch = input.match(/deck=([0-9;]+)/);
    if (!deckMatch) {
      return { error: 'Could not find deck card IDs in the input.' };
    }
    cardIds = deckMatch[1].split(';').filter(id => id.length > 0);
    if (cardIds.length !== 8) {
      return { error: `Expected 8 cards but found ${cardIds.length}.` };
    }
    const ttMatch = input.match(/tt=(\d+)/);
    towerTroop = ttMatch ? ttMatch[1] : null;
  }

  const slotsMatch = input.match(/slots=([0-9;]+)/);
  slots = slotsMatch ? slotsMatch[1].split(';').map(Number) : [];

  return { cardIds, towerTroop, slots };
}
