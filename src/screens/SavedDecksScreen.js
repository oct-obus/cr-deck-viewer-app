import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, Alert,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SavedDeckRow from '../components/SavedDeckRow';
import SavedDeckGridItem from '../components/SavedDeckGridItem';
import cardData from '../data/cardDataProvider';
import { useDeckContext } from '../context/DeckContext';
import { useSettings } from '../context/SettingsContext';
import { colors, radii, fontSize as fs, fontWeight as fw, TAB_BAR_PADDING } from '../shared/theme';

export default function SavedDecksScreen() {
  const { savedDecks: decks, onDeckLoad, onDeckDelete } = useDeckContext();
  const { settings } = useSettings();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [groupBy, setGroupBy] = useState('none');

  const isGrid = settings.savedDecksView === 'grid';
  const entrySize = settings.savedDeckSize;

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
      const wincons = (deck.cardIds || []).filter(id => cardData[id]?.isWinCondition);
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

  // Grid column count based on screen width and entry size
  const numColumns = useMemo(() => {
    if (!isGrid) return 1;
    const itemWidth = entrySize === 'small' ? 140 : entrySize === 'large' ? 220 : 170;
    return Math.max(2, Math.floor((width - 32) / itemWidth));
  }, [isGrid, entrySize, width]);

  if (decks.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Saved Decks</Text>
          <Text style={styles.emptySubtitle}>
            View a deck and save it to see it here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderGroup = ({ item: group }) => (
    <View>
      {group.label && (
        <View style={styles.groupHeader}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <Text style={styles.groupCount}>{group.count}</Text>
        </View>
      )}
      {isGrid ? (
        <View style={styles.gridContainer}>
          {group.items.map(({ deck, originalIndex }) => (
            <SavedDeckGridItem
              key={originalIndex}
              deck={deck}
              index={originalIndex}
              onLoad={handleLoad}
              onDelete={handleDelete}
              size={entrySize}
              numColumns={numColumns}
            />
          ))}
        </View>
      ) : (
        group.items.map(({ deck, originalIndex }) => (
          <SavedDeckRow
            key={originalIndex}
            deck={deck}
            index={originalIndex}
            onLoad={handleLoad}
            onDelete={handleDelete}
            size={entrySize}
          />
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
        renderItem={renderGroup}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fs.xxl,
    fontWeight: fw.heavy,
  },
  count: {
    color: colors.textMuted,
    fontSize: fs.lg,
    marginLeft: 8,
    fontWeight: fw.semibold,
  },
  spacer: { flex: 1 },
  groupBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.xl,
    backgroundColor: colors.overlay06,
  },
  groupBtnActive: {
    backgroundColor: colors.accentBg,
  },
  groupBtnText: {
    color: colors.textMuted,
    fontSize: fs.sm,
    fontWeight: fw.normal,
  },
  groupBtnTextActive: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_PADDING,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  groupLabel: {
    color: colors.textPrimary,
    fontSize: fs.lg,
    fontWeight: fw.bold,
  },
  groupCount: {
    color: colors.textSubtle,
    fontSize: fs.sm,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fs.xl,
    fontWeight: fw.bold,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSubtle,
    fontSize: fs.md,
    textAlign: 'center',
  },
});
