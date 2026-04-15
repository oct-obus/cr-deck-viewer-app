import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';

// Single card in the deck display (8-slot view)
export default function DeckCard({ card, index, onPress, onLongPress, size = 'normal' }) {
  if (!card) {
    return (
      <Pressable style={[styles.container, styles.empty, sizeStyles[size]]} onPress={onPress}>
        <View style={styles.emptySlot}>
          <Text style={styles.emptyText}>+</Text>
        </View>
      </Pressable>
    );
  }

  const imageSource = getCardImage(card, index);
  const rarityColor = RARITY_COLORS[card.rarity] || '#666';

  return (
    <Pressable
      style={[styles.container, sizeStyles[size]]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.imageWrapper, { borderColor: rarityColor }]}>
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      </View>
      <Text style={[styles.name, { color: rarityColor }]} numberOfLines={1}>
        {card.name}
      </Text>
      <View style={styles.elixirRow}>
        <View style={styles.elixirDot} />
        <Text style={styles.elixirText}>{card.elixir}</Text>
      </View>
    </Pressable>
  );
}

const sizeStyles = {
  normal: { width: 80 },
  small: { width: 60 },
  tiny: { width: 44 },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
  },
  empty: {},
  emptySlot: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '300',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  elixirRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  elixirDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#b8a5ff',
    marginRight: 3,
  },
  elixirText: {
    fontSize: 11,
    color: '#b8a5ff',
    fontWeight: '700',
  },
});
