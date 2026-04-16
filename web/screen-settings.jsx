import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { PhoneFrame, ScreenHarness } from './harness';
import SettingsScreen from '../src/screens/SettingsScreen';

function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', minHeight: '100vh' }}>
      <PhoneFrame width={393} height={852} label="Settings">
        <ScreenHarness>
          <SettingsScreen />
        </ScreenHarness>
      </PhoneFrame>
    </View>
  );
}

createRoot(document.getElementById('root')).render(<App />);
