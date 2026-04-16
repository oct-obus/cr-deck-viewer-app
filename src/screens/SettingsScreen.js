import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';

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

          <Text style={[styles.label, { marginTop: 16 }]}>Entry Size</Text>
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
    backgroundColor: '#0a0a1a',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  label: {
    color: '#e8e8f0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#f0c040',
  },
  segmentText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#0a0a1a',
    fontWeight: '800',
  },
});
