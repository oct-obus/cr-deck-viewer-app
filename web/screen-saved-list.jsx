import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { PhoneFrame, ScreenHarness } from './harness';
import SavedDecksScreen from '../src/screens/SavedDecksScreen';

function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', minHeight: '100vh' }}>
      <PhoneFrame width={393} height={852} label="Saved Decks — List View (Medium)">
        <ScreenHarness savedDecksView="list" savedDeckSize="medium">
          <SavedDecksScreen />
        </ScreenHarness>
      </PhoneFrame>
    </View>
  );
}

createRoot(document.getElementById('root')).render(<App />);
