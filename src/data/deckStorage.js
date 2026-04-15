// Deck storage using AsyncStorage — React Native equivalent of localStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cr_saved_decks';

export async function getSavedDecks() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function setSavedDecks(decks) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (e) {
    throw new Error('Failed to save decks: ' + e.message);
  }
}

export async function saveDeck(deck, existingDecks) {
  const decks = existingDecks ? [...existingDecks] : await getSavedDecks();
  const sortedNew = [...deck.cardIds].sort().join(',');

  const dupeIndex = decks.findIndex(d =>
    [...d.cardIds].sort().join(',') === sortedNew
  );

  const newEntry = {
    name: deck.name || 'Unnamed Deck',
    cardIds: deck.cardIds,
    tt: deck.tt || null,
    slots: deck.slots || [],
    savedAt: new Date().toISOString(),
  };

  if (dupeIndex >= 0) {
    decks[dupeIndex] = newEntry;
  } else {
    decks.unshift(newEntry);
  }

  await setSavedDecks(decks);
  return decks;
}

export async function deleteDeck(index) {
  const decks = await getSavedDecks();
  decks.splice(index, 1);
  await setSavedDecks(decks);
  return decks;
}
