import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import DeckDisplay from '../src/components/DeckDisplay';
import DeckCard from '../src/components/DeckCard';
import SavedDeckRow from '../src/components/SavedDeckRow';
import SavedDeckGridItem from '../src/components/SavedDeckGridItem';

const SAMPLE_DECKS = [
  {
    name: 'Hog 2.6 Cycle',
    cardIds: ['26000021','26000030','26000010','28000016','26000084','26000001','28000000','28000008'],
    savedAt: Date.now() - 86400000,
  },
  {
    name: 'Golem Beatdown',
    cardIds: ['26000009','26000051','26000041','28000006','28000018','26000032','26000057','27000010'],
    savedAt: Date.now() - 172800000,
  },
  {
    name: 'Lava Hound',
    cardIds: ['26000029','26000026','26000072','28000012','26000049','28000000','27000008','26000005'],
    savedAt: Date.now() - 259200000,
  },
  {
    name: 'Log Bait',
    cardIds: ['26000026','28000004','26000041','26000012','26000010','26000049','26000025','28000000'],
    savedAt: Date.now() - 345600000,
  },
];

function PhoneFrame({ width, label, children }) {
  return (
    <View style={frameStyles.wrapper}>
      <Text style={frameStyles.label}>{label} ({width}pt)</Text>
      <View style={[frameStyles.phone, { width }]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const frameStyles = StyleSheet.create({
  wrapper: { marginRight: 24, marginBottom: 24 },
  label: { color: '#f0c040', fontSize: 14, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  phone: { height: 700, backgroundColor: '#0a0a1a', borderRadius: 20, borderWidth: 2, borderColor: '#333', overflow: 'hidden' },
});

function SettingsBar() {
  const { settings, updateSetting } = useSettings();
  return (
    <View style={barStyles.bar}>
      <SettingToggle
        label="Deck Layout"
        options={[{ v: '2x4', l: '2×4' }, { v: '1x8', l: '1×8' }]}
        current={settings.deckLayout}
        onChange={(v) => updateSetting('deckLayout', v)}
      />
      <SettingToggle
        label="View Mode"
        options={[{ v: 'list', l: 'List' }, { v: 'grid', l: 'Grid' }]}
        current={settings.savedDecksView}
        onChange={(v) => updateSetting('savedDecksView', v)}
      />
      <SettingToggle
        label="Entry Size"
        options={[{ v: 'small', l: 'S' }, { v: 'medium', l: 'M' }, { v: 'large', l: 'L' }]}
        current={settings.savedDeckSize}
        onChange={(v) => updateSetting('savedDeckSize', v)}
      />
    </View>
  );
}

function SettingToggle({ label, options, current, onChange }) {
  return (
    <View style={barStyles.group}>
      <Text style={barStyles.groupLabel}>{label}</Text>
      <View style={barStyles.toggleRow}>
        {options.map(o => (
          <Pressable
            key={o.v}
            style={[barStyles.toggle, current === o.v && barStyles.toggleActive]}
            onPress={() => onChange(o.v)}
          >
            <Text style={[barStyles.toggleText, current === o.v && barStyles.toggleTextActive]}>{o.l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 24, padding: 16, backgroundColor: '#111', borderRadius: 12, marginBottom: 24, flexWrap: 'wrap' },
  group: {},
  groupLabel: { color: '#888', fontSize: 11, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  toggleRow: { flexDirection: 'row', gap: 4 },
  toggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#222' },
  toggleActive: { backgroundColor: '#f0c040' },
  toggleText: { color: '#888', fontSize: 13, fontWeight: '600' },
  toggleTextActive: { color: '#0a0a1a', fontWeight: '800' },
});

function PreviewContent() {
  const { settings } = useSettings();
  const isGrid = settings.savedDecksView === 'grid';
  const noop = () => {};

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={mainStyles.root}>
      <Text style={mainStyles.heading}>CR Deck Viewer - Layout Preview</Text>
      <Text style={mainStyles.subtitle}>Dev tool for verifying layouts across screen sizes</Text>

      <SettingsBar />

      <Text style={mainStyles.sectionTitle}>Deck Display ({settings.deckLayout})</Text>
      <View style={mainStyles.phoneRow}>
        <PhoneFrame width={375} label="iPhone SE">
          <DeckDisplay cardIds={SAMPLE_DECKS[0].cardIds} />
        </PhoneFrame>
        <PhoneFrame width={393} label="iPhone 14 Pro">
          <DeckDisplay cardIds={SAMPLE_DECKS[0].cardIds} />
        </PhoneFrame>
        <PhoneFrame width={430} label="iPhone 15 Pro Max">
          <DeckDisplay cardIds={SAMPLE_DECKS[0].cardIds} />
        </PhoneFrame>
      </View>

      <Text style={mainStyles.sectionTitle}>
        Saved Decks - {isGrid ? 'Grid' : 'List'} View ({settings.savedDeckSize})
      </Text>
      <View style={mainStyles.phoneRow}>
        <PhoneFrame width={375} label="iPhone SE">
          {isGrid ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SAMPLE_DECKS.map((deck, i) => (
                <SavedDeckGridItem
                  key={i} deck={deck} index={i}
                  onLoad={noop} onDelete={noop}
                  size={settings.savedDeckSize} numColumns={2}
                />
              ))}
            </View>
          ) : (
            SAMPLE_DECKS.map((deck, i) => (
              <SavedDeckRow
                key={i} deck={deck} index={i}
                onLoad={noop} onDelete={noop}
                size={settings.savedDeckSize}
              />
            ))
          )}
        </PhoneFrame>
        <PhoneFrame width={393} label="iPhone 14 Pro">
          {isGrid ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SAMPLE_DECKS.map((deck, i) => (
                <SavedDeckGridItem
                  key={i} deck={deck} index={i}
                  onLoad={noop} onDelete={noop}
                  size={settings.savedDeckSize} numColumns={2}
                />
              ))}
            </View>
          ) : (
            SAMPLE_DECKS.map((deck, i) => (
              <SavedDeckRow
                key={i} deck={deck} index={i}
                onLoad={noop} onDelete={noop}
                size={settings.savedDeckSize}
              />
            ))
          )}
        </PhoneFrame>
        <PhoneFrame width={430} label="iPhone 15 Pro Max">
          {isGrid ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SAMPLE_DECKS.map((deck, i) => (
                <SavedDeckGridItem
                  key={i} deck={deck} index={i}
                  onLoad={noop} onDelete={noop}
                  size={settings.savedDeckSize} numColumns={2}
                />
              ))}
            </View>
          ) : (
            SAMPLE_DECKS.map((deck, i) => (
              <SavedDeckRow
                key={i} deck={deck} index={i}
                onLoad={noop} onDelete={noop}
                size={settings.savedDeckSize}
              />
            ))
          )}
        </PhoneFrame>
      </View>
    </ScrollView>
  );
}

const mainStyles = StyleSheet.create({
  root: { padding: 24, paddingBottom: 100 },
  heading: { color: '#e8e8f0', fontSize: 28, fontWeight: '900', marginBottom: 4 },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 24 },
  sectionTitle: { color: '#f0c040', fontSize: 18, fontWeight: '800', marginBottom: 16, marginTop: 16 },
  phoneRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
});

function App() {
  return (
    <SettingsProvider>
      <PreviewContent />
    </SettingsProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
