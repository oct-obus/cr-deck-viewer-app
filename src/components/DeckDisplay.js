import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import DeckCard from './DeckCard';
import { computeDeckStats } from '../shared/deckStats';
import cardData from '../data/cardDataProvider';
import { useSettings } from '../context/SettingsContext';

export default function DeckDisplay({ cardIds }) {
  const { settings } = useSettings();
  if (!cardIds || cardIds.length === 0) return null;

  const stats = computeDeckStats(cardIds, cardData);
  const is1x8 = settings.deckLayout === '1x8';

  return (
    <GlassView
      style={styles.container}
      {...(liquidGlassSupported ? { effect: 'regular', colorScheme: 'dark' } : {})}
    >
      {is1x8 ? (
        <View style={styles.row}>
          {cardIds.map((id, i) => (
            <View key={i} style={styles.rowCell}>
              <DeckCard card={cardData[id]} index={i} size="grid" />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.grid}>
          {cardIds.map((id, i) => (
            <View key={i} style={styles.gridCell}>
              <DeckCard card={cardData[id]} index={i} size="grid" />
            </View>
          ))}
        </View>
      )}
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
  },
  gridCell: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
  },
  rowCell: {
    width: '12.5%',
    alignItems: 'center',
    paddingHorizontal: 1,
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
