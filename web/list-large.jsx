import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, ScrollView } from 'react-native';
import { SettingsProvider } from '../src/context/SettingsContext';
import SavedDeckRow from '../src/components/SavedDeckRow';
import SavedDeckGridItem from '../src/components/SavedDeckGridItem';

const SAMPLE_DECKS = [
  { name: 'Hog 2.6 Cycle', cardIds: ['26000021','26000030','26000010','28000016','26000084','26000001','28000000','28000008'], savedAt: Date.now() - 86400000 },
  { name: 'Golem Beatdown', cardIds: ['26000009','26000051','26000041','28000006','28000018','26000032','26000057','27000010'], savedAt: Date.now() - 172800000 },
  { name: 'Lava Hound', cardIds: ['26000029','26000026','26000072','28000012','26000049','28000000','27000008','26000005'], savedAt: Date.now() - 259200000 },
  { name: 'Log Bait', cardIds: ['26000026','28000004','26000041','26000012','26000010','26000049','26000025','28000000'], savedAt: Date.now() - 345600000 },
];

const WIDTHS = [375, 393, 430];
const LABELS = ['iPhone SE (375pt)', 'iPhone 14 Pro (393pt)', 'iPhone 15 Pro Max (430pt)'];
const noop = () => {};

function PhoneFrame({ width, label, children }) {
  return (
    <View style={{ marginRight: 20, marginBottom: 20 }}>
      <Text style={{ color: '#f0c040', fontSize: 13, fontWeight: '700', marginBottom: 6, textAlign: 'center' }}>{label}</Text>
      <View style={{ width, backgroundColor: '#0a0a1a', borderRadius: 14, borderWidth: 2, borderColor: '#333', overflow: 'hidden', padding: 14 }}>
        {children}
      </View>
    </View>
  );
}

function Section({ title, view, size }) {
  return (
    <View style={{ marginBottom: 40 }}>
      <Text style={{ color: '#f0c040', fontSize: 18, fontWeight: '800', marginBottom: 12, backgroundColor: '#1a1a2e', padding: 10, borderRadius: 8 }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {WIDTHS.map((w, i) => (
          <PhoneFrame key={w} width={w} label={LABELS[i]}>
            {view === 'list' ? (
              SAMPLE_DECKS.map((deck, j) => (
                <SavedDeckRow key={j} deck={deck} index={j} onLoad={noop} onDelete={noop} size={size} />
              ))
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SAMPLE_DECKS.map((deck, j) => (
                  <SavedDeckGridItem key={j} deck={deck} index={j} onLoad={noop} onDelete={noop} size={size} numColumns={2} />
                ))}
              </View>
            )}
          </PhoneFrame>
        ))}
      </View>
    </View>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: '#e8e8f0', fontSize: 24, fontWeight: '900', marginBottom: 20 }}>Saved Decks — All Variations</Text>
        <Section title="LIST VIEW — Small" view="list" size="small" />
        <Section title="LIST VIEW — Medium" view="list" size="medium" />
        <Section title="LIST VIEW — Large" view="list" size="large" />
        <Section title="GRID VIEW — Small" view="grid" size="small" />
        <Section title="GRID VIEW — Medium" view="grid" size="medium" />
        <Section title="GRID VIEW — Large" view="grid" size="large" />
      </ScrollView>
    </SettingsProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
