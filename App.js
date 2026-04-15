import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StatusBar,
  StyleSheet, SafeAreaView,
} from 'react-native';
import DeckBuilderScreen from './src/screens/DeckBuilderScreen';
import SavedDecksScreen from './src/screens/SavedDecksScreen';
import { getSavedDecks, deleteDeck } from './src/data/deckStorage';
import cardData from './src/data/cardDataProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
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
      setLoadedDeck(deck);
      setActiveTab('builder');
    }
  }, [savedDecks]);

  const handleDeckDelete = useCallback(async (index) => {
    const newDecks = await deleteDeck(index);
    setSavedDecks(newDecks);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {activeTab === 'builder' ? (
        <DeckBuilderScreen
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

      {/* Tab bar */}
      <SafeAreaView style={styles.tabBarSafe}>
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === 'builder' && styles.tabActive]}
            onPress={() => setActiveTab('builder')}
          >
            <Text style={styles.tabIcon}>🔨</Text>
            <Text style={[styles.tabLabel, activeTab === 'builder' && styles.tabLabelActive]}>
              Builder
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={styles.tabIcon}>📋</Text>
            <Text style={[styles.tabLabel, activeTab === 'saved' && styles.tabLabelActive]}>
              Saved ({savedDecks.length})
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
    paddingVertical: 10,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: '#f0c040',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#f0c040',
  },
});
