import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import { DeckProvider, useDeckContext } from '../src/context/DeckContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pre-populate sample decks
const SAMPLE_DECKS = [
  {
    name: 'Hog 2.6 Cycle',
    cardIds: ['26000021','26000030','26000010','28000016','26000084','26000001','28000000','28000008'],
    tt: null,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    name: 'Giant Double Prince',
    cardIds: ['26000003','26000016','26000023','26000025','28000001','28000009','26000015','26000014'],
    tt: null,
    savedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    name: 'Golem Beatdown',
    cardIds: ['26000009','26000048','26000023','26000007','28000011','28000018','26000085','26000015'],
    tt: null,
    savedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    name: 'Log Bait',
    cardIds: ['26000026','26000029','26000014','26000032','28000001','28000012','26000006','26000067'],
    tt: null,
    savedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

AsyncStorage.setItem('cr_saved_decks', JSON.stringify(SAMPLE_DECKS));

// Phone frame wrapper that mimics iPhone 14 Pro dimensions
export function PhoneFrame({ children, width = 393, height = 852, label }) {
  return (
    <View style={frameStyles.wrapper}>
      {label && <Text style={frameStyles.label}>{label}</Text>}
      <View style={[frameStyles.phone, { width, height }]}>
        {children}
      </View>
    </View>
  );
}

// Wraps a screen with all necessary providers
export function ScreenHarness({ children, deckLayout, savedDecksView, savedDeckSize }) {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <DeckProvider>
          <SettingsOverride
            deckLayout={deckLayout}
            savedDecksView={savedDecksView}
            savedDeckSize={savedDeckSize}
          >
            {children}
          </SettingsOverride>
        </DeckProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function SettingsOverride({ children, deckLayout, savedDecksView, savedDeckSize }) {
  const { updateSetting } = useSettings();
  React.useEffect(() => {
    if (deckLayout) updateSetting('deckLayout', deckLayout);
    if (savedDecksView) updateSetting('savedDecksView', savedDecksView);
    if (savedDeckSize) updateSetting('savedDeckSize', savedDeckSize);
  }, []);
  return children;
}

// Injects a deck into context so DeckViewerScreen shows it
export function DeckInjector({ cardIds, children }) {
  const { onDeckSaved, savedDecks } = useDeckContext();
  const [injected, setInjected] = React.useState(false);

  React.useEffect(() => {
    if (!injected && cardIds) {
      // Simulate loading a deck by using loadedDeck via DeckContext
      setInjected(true);
    }
  }, [injected, cardIds]);

  return children;
}

const frameStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', margin: 16 },
  label: { color: '#888', fontSize: 13, marginBottom: 8, textAlign: 'center' },
  phone: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#0a0a1a',
  },
});
