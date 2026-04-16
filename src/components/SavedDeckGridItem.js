import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import cardData from '../data/cardDataProvider';
import { colors, radii, fontSize as fs, fontWeight as fw, THUMB_HEIGHTS, shared } from '../shared/theme';

export default function SavedDeckGridItem({ deck, index, onLoad, onDelete, size = 'medium', numColumns = 2 }) {
  const thumbHeight = THUMB_HEIGHTS[size] || THUMB_HEIGHTS.medium;

  const cards = deck.cardIds.map((id, i) => {
    const card = cardData[id];

    if (!card) {
      return (
        <View key={i} style={styles.thumbCell}>
          <View style={[styles.thumb, { height: thumbHeight }, styles.unknownThumb]}>
            <Text style={styles.unknownText}>?</Text>
          </View>
        </View>
      );
    }

    const imageSource = getCardImage(card, i);
    const rarityColor = RARITY_COLORS[card.rarity] || colors.rarityFallback;

    return (
      <View key={i} style={styles.thumbCell}>
        <View style={[styles.thumb, { height: thumbHeight, borderColor: rarityColor }]}>
          <Image source={imageSource} style={shared.thumbImage} resizeMode="cover" />
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
    backgroundColor: colors.glassBg,
    borderRadius: radii.lg,
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
    borderRadius: radii.sm,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: colors.cardImageBg,
  },
  unknownThumb: {
    borderColor: colors.textSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unknownText: {
    fontSize: fs.lg,
    color: colors.textSubtle,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fs.sm,
    fontWeight: fw.semibold,
    textAlign: 'center',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.textMuted,
    fontSize: fs.xs,
  },
  deleteText: {
    color: colors.error,
    fontSize: fs.sm,
    fontWeight: fw.bold,
  },
});
