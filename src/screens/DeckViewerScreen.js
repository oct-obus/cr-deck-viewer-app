import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, Alert,
  StyleSheet, TextInput, Linking, Share,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DeckDisplay from '../components/DeckDisplay';
import cardData from '../data/cardDataProvider';
import { generateDeckName } from '../shared/deckNaming';
import { encodeDeck } from '../shared/deckUrl';
import { parseDeckString } from '../shared/deckParser';
import { saveDeck } from '../data/deckStorage';
import { useDeckContext } from '../context/DeckContext';

export default function DeckViewerScreen() {
  const { onDeckSaved, savedDecks, loadedDeck } = useDeckContext();
  const tabBarHeight = useBottomTabBarHeight();
  const [inputText, setInputText] = useState('');
  const [deckCardIds, setDeckCardIds] = useState([]);
  const [towerTroop, setTowerTroop] = useState(null);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Load deck from saved decks tab
  useEffect(() => {
    if (loadedDeck) {
      setDeckCardIds(loadedDeck.cardIds || []);
      setTowerTroop(loadedDeck.tt || null);
      setShowInput(false);
      setError('');
      setInputText('');
    }
  }, [loadedDeck]);

  const handleShowDeck = useCallback(() => {
    setError('');
    const result = parseDeckString(inputText);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDeckCardIds(result.cardIds);
    setTowerTroop(result.towerTroop || null);
    setShowInput(false);
  }, [inputText]);

  const handleNewDeck = useCallback(() => {
    setDeckCardIds([]);
    setTowerTroop(null);
    setShowInput(true);
    setInputText('');
    setError('');
  }, []);

  const handleSave = useCallback(() => {
    if (deckCardIds.length !== 8) return;
    const suggested = generateDeckName(deckCardIds, cardData);
    setSaveName(suggested);
    setShowSaveModal(true);
  }, [deckCardIds]);

  const confirmSave = useCallback(async () => {
    try {
      const newDecks = await saveDeck({
        name: saveName || 'Unnamed Deck',
        cardIds: deckCardIds,
        tt: towerTroop,
        slots: [],
      }, savedDecks);
      onDeckSaved(newDecks);
      setShowSaveModal(false);
    } catch (e) {
      Alert.alert('Save Failed', e.message);
    }
  }, [saveName, deckCardIds, towerTroop, savedDecks, onDeckSaved]);

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
      const shareContent = Platform.OS === 'ios' ? { url } : { message: url };
      await Share.share(shareContent);
    } catch {}
  }, [deckCardIds, towerTroop]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 16 }]}>
          <Text style={styles.title}>CR Deck Viewer</Text>

          {showInput ? (
            <View style={styles.inputArea}>
              <TextInput
                style={styles.textInput}
                placeholder={'Paste a Clash Royale deck share link here...\n\nExample: https://link.clashroyale.com/en?clashroyale://copyDeck?deck=27000013;28000017;...'}
                placeholderTextColor="#555"
                value={inputText}
                onChangeText={setInputText}
                multiline
                autoCorrect={false}
                autoCapitalize="none"
                textAlignVertical="top"
              />
              <View style={styles.inputButtons}>
                <Pressable style={styles.primaryBtn} onPress={handleShowDeck}>
                  <Text style={styles.primaryBtnText}>Show Deck</Text>
                </Pressable>
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          ) : (
            <View style={styles.collapsedInput}>
              <Pressable style={styles.newDeckBtn} onPress={handleNewDeck}>
                <Text style={styles.newDeckBtnText}>New Deck</Text>
              </Pressable>
            </View>
          )}

          {deckCardIds.length > 0 && (
            <>
              <DeckDisplay cardIds={deckCardIds} />
              <View style={styles.deckActions}>
                <Pressable style={styles.actionBtn} onPress={handleCopyToGame}>
                  <Text style={styles.actionBtnText}>Copy to CR</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={handleShare}>
                  <Text style={styles.actionBtnText}>Share Link</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save Deck</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Name Modal */}
      <Modal visible={showSaveModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Deck</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Deck name"
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
              <Pressable style={styles.modalSaveBtn} onPress={confirmSave}>
                <Text style={styles.modalSaveBtnText}>Save</Text>
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
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  // Input area
  inputArea: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    color: '#e8e8f0',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0a0a1a',
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 8,
  },
  // Collapsed input
  collapsedInput: {
    marginBottom: 12,
  },
  newDeckBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  newDeckBtnText: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  // Deck actions
  deckActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#0a0a1a',
    fontSize: 14,
    fontWeight: '800',
  },
  // Save modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    color: '#e8e8f0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    color: '#e8e8f0',
    fontSize: 15,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  modalSaveBtn: {
    backgroundColor: '#f0c040',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveBtnText: {
    color: '#0a0a1a',
    fontSize: 15,
    fontWeight: '700',
  },
});
