import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  StyleSheet, TextInput, Linking, Share,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeckDisplay from '../components/DeckDisplay';
import cardData from '../data/cardDataProvider';
import { generateDeckName } from '../shared/deckNaming';
import { encodeDeck } from '../shared/deckUrl';
import { parseDeckString } from '../shared/deckParser';
import { saveDeck } from '../data/deckStorage';
import { useDeckContext } from '../context/DeckContext';

export default function DeckViewerScreen() {
  const { onDeckSaved, savedDecks, loadedDeck } = useDeckContext();
  const [inputText, setInputText] = useState('');
  const [deckCardIds, setDeckCardIds] = useState([]);
  const [towerTroop, setTowerTroop] = useState(null);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    if (loadedDeck) {
      setDeckCardIds(loadedDeck.cardIds || []);
      setTowerTroop(loadedDeck.tt || null);
      setShowInput(false);
      setShowManualInput(false);
      setError('');
      setInputText('');
    }
  }, [loadedDeck]);

  const parseDeck = useCallback((text) => {
    setError('');
    const result = parseDeckString(text);
    if (result.error) {
      setError(result.error);
      return false;
    }
    setDeckCardIds(result.cardIds);
    setTowerTroop(result.towerTroop || null);
    setShowInput(false);
    setShowManualInput(false);
    return true;
  }, []);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      if (!text || !text.trim()) {
        setError('Clipboard is empty. Copy a deck link first.');
        return;
      }
      parseDeck(text.trim());
    } catch {
      setError('Could not read clipboard.');
    }
  }, [parseDeck]);

  const handleShowDeck = useCallback(() => {
    parseDeck(inputText);
  }, [inputText, parseDeck]);

  const handleNewDeck = useCallback(() => {
    setDeckCardIds([]);
    setTowerTroop(null);
    setShowInput(true);
    setShowManualInput(false);
    setInputText('');
    setError('');
  }, []);

  const handleSave = useCallback(() => {
    if (deckCardIds.length !== 8) return;
    const suggested = generateDeckName(deckCardIds, cardData);

    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Save Deck',
        'Enter a name for this deck:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: async (name) => {
              try {
                const newDecks = await saveDeck({
                  name: name || suggested || 'Unnamed Deck',
                  cardIds: deckCardIds,
                  tt: towerTroop,
                  slots: [],
                }, savedDecks);
                onDeckSaved(newDecks);
              } catch (e) {
                Alert.alert('Save Failed', e.message);
              }
            },
          },
        ],
        'plain-text',
        suggested,
      );
    } else {
      // Android fallback — Alert.prompt not available
      Alert.alert('Save Deck', `Save as "${suggested}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async () => {
            try {
              const newDecks = await saveDeck({
                name: suggested || 'Unnamed Deck',
                cardIds: deckCardIds,
                tt: towerTroop,
                slots: [],
              }, savedDecks);
              onDeckSaved(newDecks);
            } catch (e) {
              Alert.alert('Save Failed', e.message);
            }
          },
        },
      ]);
    }
  }, [deckCardIds, towerTroop, savedDecks, onDeckSaved]);

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
    const url = `https://cb.2d.rocks/david/cr-deck/?d=${compact}`;
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
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>CR Deck Viewer</Text>

          {showInput ? (
            <View style={styles.inputArea}>
              <Pressable style={styles.pasteBtn} onPress={handlePasteFromClipboard}>
                <Text style={styles.pasteBtnText}>Paste from Clipboard</Text>
              </Pressable>

              {!showManualInput ? (
                <Pressable onPress={() => setShowManualInput(true)}>
                  <Text style={styles.manualLink}>Or enter link manually...</Text>
                </Pressable>
              ) : (
                <>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Paste a deck share link..."
                    placeholderTextColor="#555"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    autoCorrect={false}
                    autoCapitalize="none"
                    textAlignVertical="top"
                    returnKeyType="go"
                    onSubmitEditing={handleShowDeck}
                  />
                  <Pressable style={styles.showBtn} onPress={handleShowDeck}>
                    <Text style={styles.showBtnText}>Show Deck</Text>
                  </Pressable>
                </>
              )}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          ) : (
            <Pressable style={styles.newDeckBtn} onPress={handleNewDeck}>
              <Text style={styles.newDeckBtnText}>New Deck</Text>
            </Pressable>
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
    paddingBottom: 100,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputArea: {
    marginBottom: 16,
  },
  pasteBtn: {
    backgroundColor: '#f0c040',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  pasteBtnText: {
    color: '#0a0a1a',
    fontSize: 17,
    fontWeight: '800',
  },
  manualLink: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    color: '#e8e8f0',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 10,
    marginBottom: 10,
  },
  showBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  showBtnText: {
    color: '#e8e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 8,
  },
  newDeckBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  newDeckBtnText: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
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
});
