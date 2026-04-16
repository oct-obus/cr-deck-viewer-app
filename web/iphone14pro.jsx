import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import SavedDeckRow from '../src/components/SavedDeckRow';
import SavedDeckGridItem from '../src/components/SavedDeckGridItem';

const SAMPLE_DECKS = [
  { name: 'Hog 2.6 Cycle', cardIds: [26000000,26000083,28000001,26000014,28000007,28000015,26000032,26000005], savedAt: '2026-04-15T12:00:00Z' },
  { name: 'Golem Beatdown', cardIds: [26000009,26000011,26000015,27000006,28000018,26000024,26000034,28000008], savedAt: '2026-04-14T18:30:00Z' },
  { name: 'Lava Hound', cardIds: [26000017,26000010,26000018,27000012,28000000,26000023,26000029,28000004], savedAt: '2026-04-13T09:15:00Z' },
  { name: 'Log Bait', cardIds: [26000006,26000019,27000009,26000026,26000067,28000009,28000002,26000049], savedAt: '2026-04-12T21:45:00Z' },
];

function Section({ title, viewMode, entrySize }) {
  const noop = () => {};
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#f59e0b', fontSize: 16, fontWeight: '700', marginBottom: 8, paddingHorizontal: 12 }}>{title}</Text>
      {viewMode === 'list' ? (
        <View style={{ paddingHorizontal: 12 }}>
          {SAMPLE_DECKS.map((deck, i) => (
            <SavedDeckRow key={i} deck={deck} index={i} onLoad={noop} onDelete={noop} size={entrySize} />
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 }}>
          {SAMPLE_DECKS.map((deck, i) => (
            <View key={i} style={{ width: '50%', padding: 4 }}>
              <SavedDeckGridItem deck={deck} index={i} onLoad={noop} onDelete={noop} size={entrySize} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function App() {
  return (
    <SettingsProvider>
      <View style={{ width: 393, margin: '0 auto', backgroundColor: '#0f172a', paddingTop: 16, paddingBottom: 32 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>iPhone 14 Pro (393pt)</Text>
        
        <Section title="LIST VIEW — Small" viewMode="list" entrySize="small" />
        <Section title="LIST VIEW — Medium" viewMode="list" entrySize="medium" />
        <Section title="LIST VIEW — Large" viewMode="list" entrySize="large" />
        <Section title="GRID VIEW — Small" viewMode="grid" entrySize="small" />
        <Section title="GRID VIEW — Medium" viewMode="grid" entrySize="medium" />
        <Section title="GRID VIEW — Large" viewMode="grid" entrySize="large" />
      </View>
    </SettingsProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
