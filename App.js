import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StatusBar,
  StyleSheet, SafeAreaView,
} from 'react-native';
import DeckViewerScreen from './src/screens/DeckViewerScreen';
import SavedDecksScreen from './src/screens/SavedDecksScreen';
import { getSavedDecks, deleteDeck } from './src/data/deckStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState('viewer');
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
      setActiveTab('viewer');
    }
  }, [savedDecks]);

  const handleDeckDelete = useCallback(async (index) => {
    const newDecks = await deleteDeck(index);
    setSavedDecks(newDecks);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {activeTab === 'viewer' ? (
        <DeckViewerScreen
          onDeckSaved={handleDeckSaved}
          savedDecks={savedDecks}
          loadedDeck={loadedDeck}
        />
      ) : (
        <SavedDecksScreen
          decks={savedDecks}
          onDeckLoad={handleDeckLoad}
          onDeckDelete={handleDeckDelete}
        />
      )}

      <SafeAreaView style={styles.tabBarSafe}>
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === 'viewer' && styles.tabActive]}
            onPress={() => setActiveTab('viewer')}
          >
            <Text style={[styles.tabLabel, activeTab === 'viewer' && styles.tabLabelActive]}>
              Viewer
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabLabel, activeTab === 'saved' && styles.tabLabelActive]}>
              Saved{savedDecks.length > 0 ? ` (${savedDecks.length})` : ''}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  tabBarSafe: {
    backgroundColor: '#0d0d1a',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0d0d1a',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: '#f0c040',
  },
  tabLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#f0c040',
  },
});
