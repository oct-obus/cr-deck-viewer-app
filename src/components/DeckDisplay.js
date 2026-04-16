import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassView, liquidGlassSupported } from './GlassView';
import DeckCard from './DeckCard';
import { computeDeckStats } from '../shared/deckStats';
import cardData from '../data/cardDataProvider';
import { useSettings } from '../context/SettingsContext';
import { colors, radii, fontSize as fs, fontWeight as fw } from '../shared/theme';

export default function DeckDisplay({ cardIds }) {
  const { settings } = useSettings();
  if (!cardIds || cardIds.length === 0) return null;

  const stats = useMemo(() => computeDeckStats(cardIds, cardData), [cardIds]);
  const is1x8 = settings.deckLayout === '1x8';
  const unknownCount = stats?.unknownCount || 0;
  const approx = unknownCount > 0;

  return (
    <GlassView
      style={styles.container}
      {...(liquidGlassSupported ? { effect: 'regular', colorScheme: 'dark' } : {})}
    >
      {is1x8 ? (
        <View style={styles.row}>
          {cardIds.map((id, i) => (
            <View key={i} style={styles.rowCell}>
              <DeckCard card={cardData[id]} index={i} size="grid" compact />
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
      {approx && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            {unknownCount} unrecognized card{unknownCount > 1 ? 's' : ''} - app data may be outdated
          </Text>
        </View>
      )}
      {stats?.avgElixir && (
        <View style={styles.statsContainer}>
          <Text style={styles.statRow}>
            Average Elixir{approx ? ' ~' : ': '}
            <Text style={styles.statValue}>{stats.avgElixir}</Text>
          </Text>
          {stats.cycleMin != null && (
            <Text style={styles.statRow}>
              4-Card Cycle:{' '}
              <Text style={styles.statValue}>{stats.cycleMin}</Text> min{' · '}
              <Text style={styles.statValue}>{stats.cycleAvg}</Text> avg{' · '}
              <Text style={styles.statValue}>{stats.cycleMax}</Text> max
            </Text>
          )}
        </View>
      )}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glassBg,
    borderRadius: radii.xl,
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
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 1,
  },
  statsContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.overlay10,
  },
  warningBanner: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.warningBg,
    borderRadius: radii.sm,
  },
  warningText: {
    color: colors.warning,
    fontSize: fs.sm,
    textAlign: 'center',
  },
  statRow: {
    color: colors.textSecondary,
    fontSize: fs.sm,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: fw.bold,
  },
});
