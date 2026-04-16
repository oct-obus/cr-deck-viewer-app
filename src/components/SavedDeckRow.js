import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import cardData from '../data/cardDataProvider';

const THUMB_HEIGHTS = {
  small:  30,
  medium: 40,
  large:  48,
};

export default function SavedDeckRow({ deck, index, onLoad, onDelete, size = 'medium' }) {
  const thumbHeight = THUMB_HEIGHTS[size] || THUMB_HEIGHTS.medium;
  const stacked = size === 'medium' || size === 'large';

  const cards = deck.cardIds.map((id, i) => {
    const card = cardData[id];
    if (!card) return null;
    const imageSource = getCardImage(card, i);
    const rarityColor = RARITY_COLORS[card.rarity] || '#444';

    const thumbStyle = stacked
      ? [styles.thumb, styles.stackedThumb, { borderColor: rarityColor }]
      : [styles.thumb, { height: thumbHeight, borderColor: rarityColor }];

    return (
      <View key={i} style={stacked ? styles.stackedThumbCell : styles.thumbCell}>
        <View style={thumbStyle}>
          <Image source={imageSource} style={styles.thumbImage} resizeMode="cover" />
        </View>
      </View>
    );
  });

  const date = new Date(deck.savedAt).toLocaleDateString();

  if (stacked) {
    return (
      <Pressable onPress={() => onLoad(index)}>
        <GlassView
          style={[styles.stackedRow, size === 'large' && styles.rowLarge]}
          {...(liquidGlassSupported ? { effect: 'clear', colorScheme: 'dark', interactive: true } : {})}
        >
          <View style={styles.stackedCardsRow}>{cards}</View>
          <View style={styles.stackedFooter}>
            <View style={styles.stackedInfo}>
              <Text style={styles.name} numberOfLines={1}>{deck.name}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <Pressable
              style={styles.deleteBtn}
              onPress={() => onDelete(index)}
              hitSlop={8}
            >
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        </GlassView>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={() => onLoad(index)}>
      <GlassView
        style={styles.row}
        {...(liquidGlassSupported ? { effect: 'clear', colorScheme: 'dark', interactive: true } : {})}
      >
      <View style={styles.cardsRow}>{cards}</View>
      <View style={styles.info}>
        <Text style={[styles.name, styles.nameSmall]} numberOfLines={1}>{deck.name}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Pressable
        style={styles.deleteBtn}
        onPress={() => onDelete(index)}
        hitSlop={8}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Small: horizontal row (cards | name/date | delete)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 26, 50, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  cardsRow: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  thumbCell: {
    paddingHorizontal: 1,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },

  // Medium/Large: stacked (cards on top, name/date/delete below)
  stackedRow: {
    backgroundColor: 'rgba(16, 26, 50, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  rowLarge: {
    padding: 14,
  },
  stackedCardsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stackedThumbCell: {
    flex: 1,
    paddingHorizontal: 1,
  },
  stackedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedInfo: {
    flex: 1,
  },

  // Shared styles
  thumb: {
    aspectRatio: 3 / 4,
    borderRadius: 4,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  stackedThumb: {
    width: '100%',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  nameSmall: {
    fontSize: 12,
  },
  date: {
    color: '#777',
    fontSize: 11,
    marginTop: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '700',
  },
});
