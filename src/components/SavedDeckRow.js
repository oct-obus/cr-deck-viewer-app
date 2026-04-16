import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import { RARITY_COLORS } from '../shared/constants';
import { getCardImage } from '../data/cardDataProvider';
import cardData from '../data/cardDataProvider';

// Compact saved deck row for the list view
export default function SavedDeckRow({ deck, index, onLoad, onDelete }) {
  const cards = deck.cardIds.map((id, i) => {
    const card = cardData[id];
    if (!card) return null;
    const imageSource = getCardImage(card, i);
    const rarityColor = RARITY_COLORS[card.rarity] || '#444';

    return (
      <View key={i} style={[styles.thumb, { borderColor: rarityColor }]}>
        <Image source={imageSource} style={styles.thumbImage} resizeMode="cover" />
      </View>
    );
  });

  const date = new Date(deck.savedAt).toLocaleDateString();

  return (
    <Pressable onPress={() => onLoad(index)}>
      <GlassView
        style={styles.row}
        {...(liquidGlassSupported ? { effect: 'clear', colorScheme: 'dark', interactive: true } : {})}
      >
      <View style={styles.cardsRow}>{cards}</View>
      <View style={styles.info}>
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
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    flex: 0,
  },
  thumb: {
    width: 32,
    height: 40,
    borderRadius: 4,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginRight: 2,
    backgroundColor: '#1a1a2e',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
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
