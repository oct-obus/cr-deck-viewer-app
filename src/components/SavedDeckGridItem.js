import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import cardData from '../data/cardDataProvider';

const THUMB_HEIGHTS = {
  small:  28,
  medium: 36,
  large:  44,
};

export default function SavedDeckGridItem({ deck, index, onLoad, onDelete, size = 'medium', numColumns = 2 }) {
  const thumbHeight = THUMB_HEIGHTS[size] || THUMB_HEIGHTS.medium;

  const cards = deck.cardIds.map((id, i) => {
    const card = cardData[id];
    if (!card) return null;
    const imageSource = getCardImage(card, i);
    const rarityColor = RARITY_COLORS[card.rarity] || '#444';

    return (
      <View key={i} style={styles.thumbCell}>
        <View style={[styles.thumb, { height: thumbHeight, borderColor: rarityColor }]}>
          <Image source={imageSource} style={styles.thumbImage} resizeMode="cover" />
        </View>
      </View>
    );
  });

  // Calculate width based on number of columns, accounting for gaps
  const itemWidth = `${Math.floor(100 / numColumns) - 1}%`;

  return (
    <Pressable onPress={() => onLoad(index)} style={{ width: itemWidth }}>
      <GlassView
        style={styles.card}
        {...(liquidGlassSupported ? { effect: 'clear', colorScheme: 'dark', interactive: true } : {})}
      >
        <View style={styles.cardGrid}>{cards}</View>
        <Text style={styles.name} numberOfLines={1}>{deck.name}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{new Date(deck.savedAt).toLocaleDateString()}</Text>
          <Pressable onPress={() => onDelete(index)} hitSlop={8}>
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        </View>
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(16, 26, 50, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  thumbCell: {
    width: '25%',
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  thumb: {
    aspectRatio: 3 / 4,
    borderRadius: 4,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#e8e8f0',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#777',
    fontSize: 10,
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontWeight: '700',
  },
});
