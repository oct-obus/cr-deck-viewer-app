import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DeckCard from './DeckCard';
import { computeDeckStats } from '../shared/deckStats';
import cardData from '../data/cardDataProvider';

let GlassView = View;
if (Platform.OS === 'ios') {
  try {
    const lg = require('@callstack/liquid-glass');
    if (lg.isLiquidGlassSupported()) GlassView = lg.LiquidGlassView;
  } catch {}
}

export default function DeckDisplay({ cardIds }) {
  if (!cardIds || cardIds.length === 0) return null;

  const stats = computeDeckStats(cardIds, cardData);

  return (
    <GlassView
      style={styles.container}
      {...(GlassView !== View ? { effect: 'regular', colorScheme: 'dark' } : {})}
    >
      <View style={styles.grid}>
        {cardIds.map((id, i) => (
          <DeckCard key={i} card={cardData[id]} index={i} />
        ))}
      </View>
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statRow}>
            Average Elixir: <Text style={styles.statValue}>{stats.avgElixir}</Text>
          </Text>
          <Text style={styles.statRow}>
            4-Card Cycle:{' '}
            <Text style={styles.statValue}>{stats.cycleMin}</Text> min{' · '}
            <Text style={styles.statValue}>{stats.cycleAvg}</Text> avg{' · '}
            <Text style={styles.statValue}>{stats.cycleMax}</Text> max
          </Text>
        </View>
      )}
    </GlassView>
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
  statsContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statRow: {
    color: '#999',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: '#e8e8f0',
    fontWeight: '700',
  },
});
