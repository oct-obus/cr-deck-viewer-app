import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import DeckDisplay from '../src/components/DeckDisplay';
import SavedDeckRow from '../src/components/SavedDeckRow';
import SavedDeckGridItem from '../src/components/SavedDeckGridItem';

const SAMPLE_DECKS = [
  { name: 'Hog 2.6 Cycle', cardIds: ['26000021','26000030','26000010','28000016','26000084','26000001','28000000','28000008'], savedAt: Date.now() - 86400000 },
  { name: 'Golem Beatdown', cardIds: ['26000009','26000051','26000041','28000006','28000018','26000032','26000057','27000010'], savedAt: Date.now() - 172800000 },
  { name: 'Lava Hound', cardIds: ['26000029','26000026','26000072','28000012','26000049','28000000','27000008','26000005'], savedAt: Date.now() - 259200000 },
  { name: 'Log Bait', cardIds: ['26000026','28000004','26000041','26000012','26000010','26000049','26000025','28000000'], savedAt: Date.now() - 345600000 },
];

const WIDTHS = [375, 393, 430];
const LABELS = ['iPhone SE', 'iPhone 14 Pro', 'iPhone 15 Pro Max'];
const noop = () => {};

function PhoneFrame({ width, label, children }) {
  return (
    <View style={{ marginRight: 16, marginBottom: 16 }}>
      <Text style={{ color: '#f0c040', fontSize: 11, fontWeight: '700', marginBottom: 4, textAlign: 'center' }}>{label} ({width}pt)</Text>
      <View style={{ width, minHeight: 300, backgroundColor: '#0a0a1a', borderRadius: 12, borderWidth: 1, borderColor: '#333', overflow: 'hidden', padding: 12 }}>
        {children}
      </View>
    </View>
  );
}

function ComboSection({ title, deckLayout, savedDecksView, savedDeckSize }) {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ color: '#f0c040', fontSize: 16, fontWeight: '800', marginBottom: 8, backgroundColor: '#1a1a2e', padding: 8, borderRadius: 6 }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {WIDTHS.map((w, i) => (
          <PhoneFrame key={w} width={w} label={LABELS[i]}>
            {savedDecksView === 'list' ? (
              SAMPLE_DECKS.map((deck, j) => (
                <SavedDeckRow key={j} deck={deck} index={j} onLoad={noop} onDelete={noop} size={savedDeckSize} />
              ))
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SAMPLE_DECKS.map((deck, j) => (
                  <SavedDeckGridItem key={j} deck={deck} index={j} onLoad={noop} onDelete={noop} size={savedDeckSize} numColumns={2} />
                ))}
              </View>
            )}
          </PhoneFrame>
        ))}
      </View>
    </View>
  );
}

function DeckDisplaySection({ title, deckLayout }) {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ color: '#f0c040', fontSize: 16, fontWeight: '800', marginBottom: 8, backgroundColor: '#1a1a2e', padding: 8, borderRadius: 6 }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {WIDTHS.map((w, i) => (
          <PhoneFrame key={w} width={w} label={LABELS[i]}>
            <DeckDisplay cardIds={SAMPLE_DECKS[0].cardIds} layout={deckLayout} />
          </PhoneFrame>
        ))}
      </View>
    </View>
  );
}

function AllCombos() {
  return (
    <SettingsProvider>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: '#e8e8f0', fontSize: 24, fontWeight: '900', marginBottom: 4 }}>All Layout Combinations</Text>
        <Text style={{ color: '#666', fontSize: 12, marginBottom: 20 }}>Every settings combo across all screen widths</Text>

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 16, borderBottomWidth: 2, borderBottomColor: '#f0c040', paddingBottom: 8 }}>DECK DISPLAY</Text>
        <DeckDisplaySection title="2×4 Grid" deckLayout="2x4" />
        <DeckDisplaySection title="1×8 Row" deckLayout="1x8" />

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 16, marginTop: 24, borderBottomWidth: 2, borderBottomColor: '#f0c040', paddingBottom: 8 }}>SAVED DECKS</Text>
        
        <ComboSection title="List View — Small" savedDecksView="list" savedDeckSize="small" />
        <ComboSection title="List View — Medium" savedDecksView="list" savedDeckSize="medium" />
        <ComboSection title="List View — Large" savedDecksView="list" savedDeckSize="large" />
        <ComboSection title="Grid View — Small" savedDecksView="grid" savedDeckSize="small" />
        <ComboSection title="Grid View — Medium" savedDecksView="grid" savedDeckSize="medium" />
        <ComboSection title="Grid View — Large" savedDecksView="grid" savedDeckSize="large" />
      </ScrollView>
    </SettingsProvider>
  );
}

createRoot(document.getElementById('root')).render(<AllCombos />);
