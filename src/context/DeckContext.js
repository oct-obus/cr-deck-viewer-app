import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Alert } from 'react-native';
import { getSavedDecks, deleteDeck } from '../data/deckStorage';

const DeckContext = createContext(null);

export function DeckProvider({ children }) {
  const [savedDecks, setSavedDecks] = useState([]);
  const [loadedDeck, setLoadedDeck] = useState(null);

  useEffect(() => {
    getSavedDecks().then(setSavedDecks);
  }, []);

  const handleDeckLoad = useCallback((index) => {
    const deck = savedDecks[index];
    if (deck) {
      // _loadTime forces a new object reference so useEffect re-fires even
      // when the user loads the same deck twice in a row.
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

  const contextValue = useMemo(() => ({
    savedDecks,
    loadedDeck,
    onDeckSaved: setSavedDecks,
    onDeckLoad: handleDeckLoad,
    onDeckDelete: handleDeckDelete,
  }), [savedDecks, loadedDeck, handleDeckLoad, handleDeckDelete]);

  return (
    <DeckContext.Provider value={contextValue}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeckContext() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeckContext must be used inside DeckProvider');
  return ctx;
}
