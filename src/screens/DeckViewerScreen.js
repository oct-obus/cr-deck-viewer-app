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
import { colors, radii, fontSize as fs, fontWeight as fw, TAB_BAR_PADDING } from '../shared/theme';

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
                    placeholderTextColor={colors.textSubtle}
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
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: TAB_BAR_PADDING,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fs.xxl,
    fontWeight: fw.heavy,
    marginBottom: 16,
  },
  inputArea: {
    marginBottom: 16,
  },
  pasteBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: radii.lg,
    alignItems: 'center',
    marginBottom: 12,
  },
  pasteBtnText: {
    color: colors.accentText,
    fontSize: fs.lg,
    fontWeight: fw.heavy,
  },
  manualLink: {
    color: colors.textMuted,
    fontSize: fs.md,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: colors.overlay06,
    borderRadius: radii.lg,
    padding: 14,
    color: colors.textPrimary,
    fontSize: fs.md,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 10,
    marginBottom: 10,
  },
  showBtn: {
    backgroundColor: colors.overlay10,
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  showBtnText: {
    color: colors.textPrimary,
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  errorText: {
    color: colors.error,
    fontSize: fs.sm,
    marginTop: 8,
  },
  newDeckBtn: {
    backgroundColor: colors.overlay08,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  newDeckBtnText: {
    color: colors.textPrimary,
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  deckActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: colors.overlay08,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.md,
  },
  actionBtnText: {
    color: colors.textPrimary,
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.md,
  },
  saveBtnText: {
    color: colors.accentText,
    fontSize: fs.md,
    fontWeight: fw.heavy,
  },
});
