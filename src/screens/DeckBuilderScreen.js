import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, Alert,
  StyleSheet, SafeAreaView, TextInput, Linking, Share,
} from 'react-native';
import DeckDisplay from '../components/DeckDisplay';
import CardPicker from '../components/CardPicker';
import cardData from '../data/cardDataProvider';
import { generateDeckName } from '../shared/deckNaming';
import { encodeDeck, decodeDeck } from '../shared/deckUrl';
import { parseDeckString } from '../shared/deckParser';
import { saveDeck } from '../data/deckStorage';

export default function DeckBuilderScreen({ onDeckSaved, savedDecks, loadedDeck }) {
  const [deckCardIds, setDeckCardIds] = useState([]);
  const [towerTroop, setTowerTroop] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Load deck from saved decks screen
  useEffect(() => {
    if (loadedDeck) {
      setDeckCardIds(loadedDeck.cardIds || []);
      setTowerTroop(loadedDeck.tt || null);
    }
  }, [loadedDeck]);

  const handleCardSelect = useCallback((cardId) => {
    setDeckCardIds(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      if (prev.length >= 8) {
        return prev;
      }
      return [...prev, cardId];
    });
  }, []);

  const handleSlotPress = useCallback((index) => {
    if (deckCardIds[index]) {
      // Remove card from this slot
      setDeckCardIds(prev => prev.filter((_, i) => i !== index));
    } else {
      setShowPicker(true);
    }
  }, [deckCardIds]);

  const handleSlotLongPress = useCallback((index) => {
    if (deckCardIds[index]) {
      Alert.alert(
        'Remove Card',
        `Remove ${cardData[deckCardIds[index]]?.name || 'this card'} from deck?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => {
            setDeckCardIds(prev => prev.filter((_, i) => i !== index));
          }},
        ]
      );
    }
  }, [deckCardIds]);

  const handleSave = useCallback(() => {
    if (deckCardIds.length !== 8) {
      Alert.alert('Incomplete Deck', 'A deck needs exactly 8 cards.');
      return;
    }
    const suggested = generateDeckName(deckCardIds, cardData);
    setSaveName(suggested);
    setShowSaveModal(true);
  }, [deckCardIds]);

  const confirmSave = useCallback(async () => {
    const newDecks = await saveDeck({
      name: saveName || 'Unnamed Deck',
      cardIds: deckCardIds,
      tt: towerTroop,
      slots: [],
    }, savedDecks);
    onDeckSaved(newDecks);
    setShowSaveModal(false);
  }, [saveName, deckCardIds, towerTroop, savedDecks, onDeckSaved]);

  const handleClear = useCallback(() => {
    setDeckCardIds([]);
    setTowerTroop(null);
  }, []);

  const handleCopyToGame = useCallback(() => {
    if (deckCardIds.length !== 8) return;
    let url = 'clashroyale://copyDeck?deck=' + deckCardIds.join(';');
    if (towerTroop) url += '&tt=' + towerTroop;
    url += '&l=Royals';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open Clash Royale.');
    });
  }, [deckCardIds, towerTroop]);

  const handleShare = useCallback(async () => {
    if (deckCardIds.length !== 8) return;
    const compact = encodeDeck(deckCardIds, towerTroop);
    if (!compact) return;
    const url = `https://clash.2d.rocks/?d=${compact}`;
    try {
      await Share.share({ message: url, url });
    } catch {}
  }, [deckCardIds, towerTroop]);

  const handleImport = useCallback(() => {
    setImportError('');
    const result = parseDeckString(importText);
    if (result.error) {
      setImportError(result.error);
      return;
    }
    setDeckCardIds(result.cardIds);
    setTowerTroop(result.towerTroop || null);
    setShowImport(false);
    setImportText('');
  }, [importText]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Deck Builder</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.importBtn} onPress={() => setShowImport(true)}>
              <Text style={styles.importBtnText}>Import</Text>
            </Pressable>
          </View>
        </View>

        <DeckDisplay
          cardIds={deckCardIds}
          onSlotPress={handleSlotPress}
          onSlotLongPress={handleSlotLongPress}
        />

        <View style={styles.actions}>
          {deckCardIds.length < 8 && (
            <Pressable style={styles.addBtn} onPress={() => setShowPicker(true)}>
              <Text style={styles.addBtnText}>+ Add Cards</Text>
            </Pressable>
          )}
          {deckCardIds.length > 0 && (
            <Pressable style={styles.clearBtn} onPress={handleClear}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {deckCardIds.length === 8 && (
          <View style={styles.deckActions}>
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Deck</Text>
            </Pressable>
            <Pressable style={styles.gameBtn} onPress={handleCopyToGame}>
              <Text style={styles.gameBtnText}>Copy to Game</Text>
            </Pressable>
            <Pressable style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>Share</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Card Picker Modal */}
      <Modal visible={showPicker} animationType="slide" presentationStyle="pageSheet">
        <CardPicker
          selectedIds={deckCardIds}
          onCardSelect={handleCardSelect}
          onClose={() => setShowPicker(false)}
        />
      </Modal>

      {/* Import Modal */}
      <Modal visible={showImport} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Import Deck</Text>
            <Text style={styles.modalSubtitle}>
              Paste a deck share link or URL
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="clashroyale://copyDeck?deck=... or URL with d=..."
              placeholderTextColor="#555"
              value={importText}
              onChangeText={setImportText}
              multiline
              autoCorrect={false}
              autoCapitalize="none"
            />
            {importError ? (
              <Text style={styles.errorText}>{importError}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => { setShowImport(false); setImportError(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalImportBtn} onPress={handleImport}>
                <Text style={styles.modalImportText}>Import</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save Name Modal */}
      <Modal visible={showSaveModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Deck</Text>
            <Text style={styles.modalSubtitle}>Enter a name for this deck</Text>
            <TextInput
              style={[styles.modalInput, { minHeight: 44 }]}
              placeholder="Deck name..."
              placeholderTextColor="#555"
              value={saveName}
              onChangeText={setSaveName}
              autoCorrect={false}
              selectTextOnFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalImportBtn} onPress={confirmSave}>
                <Text style={styles.modalImportText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#f0c040',
    fontSize: 24,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
  },
  importBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  importBtnText: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  addBtn: {
    backgroundColor: 'rgba(240, 192, 64, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240, 192, 64, 0.3)',
  },
  addBtnText: {
    color: '#f0c040',
    fontSize: 15,
    fontWeight: '700',
  },
  clearBtn: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearBtnText: {
    color: '#ff6b6b',
    fontSize: 15,
    fontWeight: '600',
  },
  deckActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  saveBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#0a0a1a',
    fontSize: 15,
    fontWeight: '800',
  },
  gameBtn: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  gameBtnText: {
    color: '#4ade80',
    fontSize: 15,
    fontWeight: '700',
  },
  shareBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareBtnText: {
    color: '#e8e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  // Import modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    color: '#e8e8f0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    color: '#e8e8f0',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#888',
    fontSize: 15,
  },
  modalImportBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalImportText: {
    color: '#0a0a1a',
    fontSize: 15,
    fontWeight: '700',
  },
});
