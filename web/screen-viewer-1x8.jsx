import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { PhoneFrame, ScreenHarness } from './harness';
import DeckViewerScreen from '../src/screens/DeckViewerScreen';
import { useDeckContext } from '../src/context/DeckContext';

function ViewerWithDeck() {
  const { onDeckLoad, savedDecks } = useDeckContext();
  useEffect(() => {
    if (savedDecks.length > 0) onDeckLoad(0);
  }, [savedDecks]);
  return <DeckViewerScreen />;
}

function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', minHeight: '100vh' }}>
      <PhoneFrame width={393} height={852} label="Viewer — 1×8 Row">
        <ScreenHarness deckLayout="1x8">
          <ViewerWithDeck />
        </ScreenHarness>
      </PhoneFrame>
    </View>
  );
}

createRoot(document.getElementById('root')).render(<App />);
