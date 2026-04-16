import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { colors, radii, fontSize as fs, fontWeight as fw, TAB_BAR_PADDING } from '../shared/theme';

function SegmentedControl({ options, selected, onChange }) {
  return (
    <View style={styles.segmented}>
      {options.map(opt => (
        <Pressable
          key={opt.value}
          style={[styles.segment, selected === opt.value && styles.segmentActive]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={[styles.segmentText, selected === opt.value && styles.segmentTextActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Deck Display</Text>
          <Text style={styles.label}>Card Layout</Text>
          <SegmentedControl
            options={[
              { value: '2x4', label: '2×4 Grid' },
              { value: '1x8', label: '1×8 Row' },
            ]}
            selected={settings.deckLayout}
            onChange={(v) => updateSetting('deckLayout', v)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Saved Decks</Text>

          <Text style={styles.label}>View Mode</Text>
          <SegmentedControl
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
            ]}
            selected={settings.savedDecksView}
            onChange={(v) => updateSetting('savedDecksView', v)}
          />

          <Text style={[styles.label, styles.labelTopMargin]}>Entry Size</Text>
          <SegmentedControl
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
            selected={settings.savedDeckSize}
            onChange={(v) => updateSetting('savedDeckSize', v)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: TAB_BAR_PADDING,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fs.xxl,
    fontWeight: fw.heavy,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: fs.sm,
    fontWeight: fw.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  label: {
    color: colors.textPrimary,
    fontSize: fs.md,
    fontWeight: fw.semibold,
    marginBottom: 8,
  },
  labelTopMargin: {
    marginTop: 16,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.overlay06,
    borderRadius: radii.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  segmentTextActive: {
    color: colors.accentText,
    fontWeight: fw.heavy,
  },
});
