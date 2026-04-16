import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import cardData from '../data/cardDataProvider';
import { colors, radii, fontSize as fs, fontWeight as fw, THUMB_HEIGHTS, shared } from '../shared/theme';

export default function SavedDeckRow({ deck, index, onLoad, onDelete, size = 'medium' }) {
  const thumbHeight = THUMB_HEIGHTS[size] || THUMB_HEIGHTS.medium;
  const stacked = size === 'medium' || size === 'large';

  const cards = deck.cardIds.map((id, i) => {
    const card = cardData[id];
    const cellStyle = stacked ? styles.stackedThumbCell : styles.thumbCell;

    if (!card) {
      const unknownStyle = stacked
        ? [styles.thumb, styles.stackedThumb, styles.unknownThumb]
        : [styles.thumb, { height: thumbHeight }, styles.unknownThumb];
      return (
        <View key={i} style={cellStyle}>
          <View style={unknownStyle}>
            <Text style={styles.unknownText}>?</Text>
          </View>
        </View>
      );
    }

    const imageSource = getCardImage(card, i);
    const rarityColor = RARITY_COLORS[card.rarity] || colors.rarityFallback;
    const thumbStyle = stacked
      ? [styles.thumb, styles.stackedThumb, { borderColor: rarityColor }]
      : [styles.thumb, { height: thumbHeight, borderColor: rarityColor }];

    return (
      <View key={i} style={cellStyle}>
        <View style={thumbStyle}>
          <Image source={imageSource} style={shared.thumbImage} resizeMode="cover" />
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
    backgroundColor: colors.glassBg,
    borderRadius: radii.lg,
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
    backgroundColor: colors.glassBg,
    borderRadius: radii.lg,
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
  stackedThumb: {
    width: '100%',
  },
  name: {
    color: colors.textPrimary,
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  nameSmall: {
    fontSize: fs.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: fs.xs,
    marginTop: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.xl,
    backgroundColor: colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteText: {
    color: colors.error,
    fontSize: fs.md,
    fontWeight: fw.bold,
  },
});
