import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DeckCard from './DeckCard';
import { computeDeckStats } from '../shared/deckStats';
import cardData from '../data/cardDataProvider';

// 4×2 deck display with stats
export default function DeckDisplay({ cardIds, onSlotPress, onSlotLongPress }) {
  const stats = cardIds.length > 0 ? computeDeckStats(cardIds, cardData) : null;

  const slots = [];
  for (let i = 0; i < 8; i++) {
    const card = cardIds[i] ? cardData[cardIds[i]] : null;
    slots.push(
      <DeckCard
        key={i}
        card={card}
        index={i}
        onPress={() => onSlotPress(i)}
        onLongPress={() => onSlotLongPress && onSlotLongPress(i)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {slots}
      </View>
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.elixirDot} />
            <Text style={styles.statValue}>{stats.avgElixir}</Text>
            <Text style={styles.statLabel}>avg</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>cycle</Text>
            <Text style={styles.statValue}>{stats.cycleMin}</Text>
            <Text style={styles.statSep}>·</Text>
            <Text style={styles.statValue}>{stats.cycleAvg}</Text>
            <Text style={styles.statSep}>·</Text>
            <Text style={styles.statValue}>{stats.cycleMax}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.typeLabel}>🗡{stats.troops}</Text>
            <Text style={styles.typeLabel}>🏰{stats.buildings}</Text>
            <Text style={styles.typeLabel}>✨{stats.spells}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(16, 26, 50, 0.5)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 2,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginHorizontal: 3,
  },
  statSep: {
    color: '#555',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  elixirDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#b8a5ff',
    marginRight: 4,
  },
  typeLabel: {
    color: '#ccc',
    fontSize: 12,
    marginHorizontal: 2,
  },
});
