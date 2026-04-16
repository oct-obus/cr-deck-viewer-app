import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';

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
  const rarityColor = RARITY_COLORS[card.rarity] || '#666';

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
    backgroundColor: '#333',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unknownText: {
    fontSize: 20,
    color: '#666',
  },
  unknownName: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
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
  elixirText: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
});
