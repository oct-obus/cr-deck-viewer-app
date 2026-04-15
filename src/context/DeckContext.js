import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import { getSavedDecks, deleteDeck } from '../data/deckStorage';

const DeckContext = createContext(null);

export function DeckProvider({ children }) {
  const [savedDecks, setSavedDecks] = useState([]);
  const [loadedDeck, setLoadedDeck] = useState(null);

  useEffect(() => {
    getSavedDecks().then(setSavedDecks);
  }, []);

  const handleDeckSaved = useCallback((newDecks) => {
    setSavedDecks(newDecks);
  }, []);

  const handleDeckLoad = useCallback((index) => {
    const deck = savedDecks[index];
    if (deck) {
      setLoadedDeck({ ...deck, _loadTime: Date.now() });
    }
  }, [savedDecks]);

  const handleDeckDelete = useCallback(async (index) => {
    try {
      const newDecks = await deleteDeck(index);
      setSavedDecks(newDecks);
    } catch (e) {
      Alert.alert('Delete Failed', e.message);
    }
  }, []);

  return (
    <DeckContext.Provider value={{
      savedDecks,
      loadedDeck,
      onDeckSaved: handleDeckSaved,
      onDeckLoad: handleDeckLoad,
      onDeckDelete: handleDeckDelete,
    }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeckContext() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeckContext must be used inside DeckProvider');
  return ctx;
}
