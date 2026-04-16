import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, StyleSheet } from 'react-native';
import App from '../App';

// Seed AsyncStorage with sample saved decks for preview
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Pre-populate saved decks
AsyncStorage.setItem('cr_saved_decks', JSON.stringify(SAMPLE_DECKS));

function PhoneFrame({ children, width = 393, height = 852, label }) {
  return (
    <View style={frameStyles.wrapper}>
      {label && <View style={frameStyles.labelBar}><text style={frameStyles.labelText}>{label}</text></View>}
      <View style={[frameStyles.phone, { width, height }]}>
        {children}
      </View>
    </View>
  );
}

const frameStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', margin: 16 },
  labelBar: { marginBottom: 8 },
  labelText: { color: '#888', fontSize: 14 },
  phone: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#0a0a1a',
  },
});

function Preview() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', minHeight: '100vh' }}>
      <PhoneFrame width={393} height={852} label="iPhone 14 Pro — 393×852pt">
        <App />
      </PhoneFrame>
    </View>
  );
}

createRoot(document.getElementById('root')).render(<Preview />);
