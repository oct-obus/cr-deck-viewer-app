import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import DeckDisplay from '../src/components/DeckDisplay';

const DECK_CARD_IDS = [
  '26000021','26000030','26000010','28000016',
  '26000084','26000001','28000000','28000008',
];

function ViewerScreen() {
  const { updateSetting } = useSettings();
  // Force 1×8 layout
  React.useEffect(() => { updateSetting('deckLayout', '1x8'); }, []);

  return (
    <View style={styles.screen}>
      {/* Status bar area */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Deck Viewer</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        {/* Paste button area */}
        <View style={styles.pasteBtn}>
          <Text style={styles.pasteBtnText}>Paste from Clipboard</Text>
        </View>

        {/* Deck display */}
        <DeckDisplay cardIds={DECK_CARD_IDS} />

        {/* Action buttons */}
        <View style={styles.actions}>
          <ActionButton label="Copy to CR" color="#4a90d9" />
          <ActionButton label="Share Link" color="#4a90d9" />
          <ActionButton label="Save Deck" color="#f0c040" />
        </View>
      </ScrollView>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TabItem label="Viewer" active />
        <TabItem label="Saved" />
        <TabItem label="Settings" />
      </View>
      <View style={styles.homeIndicator} />
    </View>
  );
}

function ActionButton({ label, color }) {
  return (
    <View style={[styles.actionBtn, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
    </View>
  );
}

function TabItem({ label, active }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabDot, active && styles.tabDotActive]} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: 393,
    height: 852,
    backgroundColor: '#0a0a1a',
    margin: '0 auto',
    overflow: 'hidden',
  },
  statusBar: {
    height: 54,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  time: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  navBar: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  navTitle: {
    color: '#e8e8f0',
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  pasteBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a3a5a',
  },
  pasteBtnText: {
    color: '#7aa2d4',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    height: 49,
    borderTopWidth: 0.5,
    borderTopColor: '#222',
    backgroundColor: '#0a0a1a',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
    marginBottom: 4,
  },
  tabDotActive: {
    backgroundColor: '#4a90d9',
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
  },
  tabLabelActive: {
    color: '#4a90d9',
  },
  homeIndicator: {
    height: 34,
    backgroundColor: '#0a0a1a',
  },
});

function App() {
  return (
    <SettingsProvider>
      <ViewerScreen />
    </SettingsProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
