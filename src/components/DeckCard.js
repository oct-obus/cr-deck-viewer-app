import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import { colors, radii, fontSize as fs, fontWeight as fw, shared } from '../shared/theme';

export default function DeckCard({ card, index, size = 'normal', compact = false }) {
  if (!card) {
    return (
      <View style={[styles.container, sizeStyles[size]]}>
        <View style={styles.unknownSlot}>
          <Text style={styles.unknownText}>?</Text>
        </View>
        {!compact && <Text style={styles.unknownName}>Unknown</Text>}
      </View>
    );
  }

  const imageSource = getCardImage(card, index);
  const rarityColor = RARITY_COLORS[card.rarity] || colors.textSubtle;

  return (
    <View style={[styles.container, sizeStyles[size]]}>
      <View style={[styles.imageWrapper, { borderColor: rarityColor }]}>
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      </View>
      {!compact && (
        <>
          <Text style={[styles.name, { color: rarityColor }]} numberOfLines={1}>
            {card.name}
          </Text>
          <Text style={styles.elixirText}>{card.elixir} elixir</Text>
        </>
      )}
    </View>
  );
}

const sizeStyles = {
  normal: { width: 80 },
  small: { width: 60 },
  tiny: { width: 44 },
  grid: { width: '100%', marginHorizontal: 0 },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
  },
  unknownSlot: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.cardUnknownBg,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unknownText: {
    fontSize: fs.xl,
    color: colors.textSubtle,
  },
  unknownName: {
    fontSize: fs.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radii.md,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: colors.cardImageBg,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: fs.xs,
    fontWeight: fw.semibold,
    marginTop: 2,
    textAlign: 'center',
  },
  elixirText: {
    fontSize: fs.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
