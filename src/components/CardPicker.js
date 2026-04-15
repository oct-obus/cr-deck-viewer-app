import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, Image, TextInput,
  Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { RARITY_COLORS } from '../shared/constants';
import { getAllCards } from '../data/cardDataProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 4;
const CARD_MARGIN = 6;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_MARGIN * (COLUMNS * 2)) / COLUMNS;

export default function CardPicker({ selectedIds, onCardSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, troop, building, spell

  const allCards = useMemo(() => getAllCards(), []);

  const filteredCards = useMemo(() => {
    let cards = allCards;
    if (filter !== 'all') {
      cards = cards.filter(c => {
        if (filter === 'building') return c.id.startsWith('27');
        if (filter === 'spell') return c.id.startsWith('28');
        return c.id.startsWith('26');
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      cards = cards.filter(c => c.name.toLowerCase().includes(q));
    }
    return cards;
  }, [allCards, filter, search]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const renderCard = ({ item }) => {
    const isSelected = selectedSet.has(item.id);
    const rarityColor = RARITY_COLORS[item.rarity] || '#666';

    return (
      <Pressable
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          { borderColor: isSelected ? rarityColor : 'transparent' },
        ]}
        onPress={() => onCardSelect(item.id)}
      >
        <Image
          source={item.localIcon}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Text style={[styles.cardName, { color: rarityColor }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.elixirBadge}>
          <Text style={styles.elixirText}>{item.elixir}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Cards</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Done</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search cards..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
      />

      <View style={styles.filters}>
        {['all', 'troop', 'building', 'spell'].map(f => (
          <Pressable
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'troop' ? '🗡 Troops' : f === 'building' ? '🏰 Buildings' : '✨ Spells'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.countText}>
        {selectedIds.length}/8 selected · {filteredCards.length} cards
      </Text>

      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#0a0a1a',
    fontWeight: '700',
    fontSize: 14,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e8e8f0',
    fontSize: 15,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  filterActive: {
    backgroundColor: 'rgba(240,192,64,0.2)',
  },
  filterText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#f0c040',
  },
  countText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    alignItems: 'center',
    backgroundColor: 'rgba(16, 26, 50, 0.4)',
    borderRadius: 10,
    padding: 4,
    borderWidth: 2,
  },
  cardSelected: {
    backgroundColor: 'rgba(16, 26, 50, 0.8)',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  elixirBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(140, 120, 220, 0.9)',
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elixirText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(74, 222, 128, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
