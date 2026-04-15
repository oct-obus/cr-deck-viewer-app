import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, Alert,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SavedDeckRow from '../components/SavedDeckRow';
import cardData from '../data/cardDataProvider';
import { useDeckContext } from '../context/DeckContext';

export default function SavedDecksScreen() {
  const { savedDecks: decks, onDeckLoad, onDeckDelete } = useDeckContext();
  const navigation = useNavigation();
  const [groupBy, setGroupBy] = useState('none');

  const handleLoad = useCallback((index) => {
    onDeckLoad(index);
    navigation.navigate('Viewer');
  }, [onDeckLoad, navigation]);

  const handleDelete = useCallback((index) => {
    Alert.alert(
      'Delete Deck',
      `Delete "${decks[index]?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeckDelete(index) },
      ]
    );
  }, [decks, onDeckDelete]);

  const groupedDecks = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', label: null, items: decks.map((d, i) => ({ deck: d, originalIndex: i })) }];
    }

    const groups = {};
    decks.forEach((deck, i) => {
      const wincons = deck.cardIds.filter(id => cardData[id]?.isWinCondition);
      let key;
      if (wincons.length === 0) {
        key = 'Other';
      } else {
        key = wincons.map(id => cardData[id]?.name || id).sort().join(' + ');
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push({ deck, originalIndex: i });
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Other') return 1;
        if (b === 'Other') return -1;
        return a.localeCompare(b);
      })
      .map(key => ({
        key,
        label: key,
        count: groups[key].length,
        items: groups[key],
      }));
  }, [decks, groupBy]);

  if (decks.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Saved Decks</Text>
          <Text style={styles.emptySubtitle}>
            View a deck and save it to see it here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Decks</Text>
        <Text style={styles.count}>{decks.length}</Text>
        <View style={styles.spacer} />
        <Pressable
          style={[styles.groupBtn, groupBy === 'wincon' && styles.groupBtnActive]}
          onPress={() => setGroupBy(prev => prev === 'none' ? 'wincon' : 'none')}
        >
          <Text style={[styles.groupBtnText, groupBy === 'wincon' && styles.groupBtnTextActive]}>
            Group by Win Con
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={groupedDecks}
        keyExtractor={item => item.key}
        renderItem={({ item: group }) => (
          <View>
            {group.label && (
              <View style={styles.groupHeader}>
                <Text style={styles.groupLabel}>{group.label}</Text>
                <Text style={styles.groupCount}>{group.count}</Text>
              </View>
            )}
            {group.items.map(({ deck, originalIndex }) => (
              <SavedDeckRow
                key={originalIndex}
                deck={deck}
                index={originalIndex}
                onLoad={handleLoad}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 22,
    fontWeight: '800',
  },
  count: {
    color: '#888',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  spacer: { flex: 1 },
  groupBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  groupBtnActive: {
    backgroundColor: 'rgba(240,192,64,0.2)',
  },
  groupBtnText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  groupBtnTextActive: {
    color: '#f0c040',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  groupLabel: {
    color: '#e8e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  groupCount: {
    color: '#666',
    fontSize: 13,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#e8e8f0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
