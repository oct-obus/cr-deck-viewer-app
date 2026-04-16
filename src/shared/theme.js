// Centralized design tokens for the CR Deck Viewer app.
// All colors, spacing, radii, and font values live here.

export const colors = {
  background: '#0a0a1a',
  surface: '#0d0d1a',
  textPrimary: '#e8e8f0',
  textSecondary: '#999',
  textMuted: '#888',
  textSubtle: '#666',
  accent: '#f0c040',
  accentText: '#0a0a1a',
  error: '#ff6b6b',
  cardImageBg: '#1a1a2e',
  cardUnknownBg: '#333',
  rarityFallback: '#444',

  glassBg: 'rgba(16, 26, 50, 0.45)',
  overlay06: 'rgba(255,255,255,0.06)',
  overlay08: 'rgba(255,255,255,0.08)',
  overlay10: 'rgba(255,255,255,0.1)',
  accentBg: 'rgba(240,192,64,0.2)',
  errorBg: 'rgba(255,107,107,0.15)',
  border: 'rgba(255,255,255,0.08)',
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const fontSize = {
  xs: 10,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 22,
};

export const fontWeight = {
  normal: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const THUMB_HEIGHTS = {
  small: 28,
  medium: 36,
  large: 44,
};

// Bottom tab bar scroll guard — enough clearance for tab bar + home indicator
export const TAB_BAR_PADDING = 100;

// Shared style fragments used across multiple screens
import { StyleSheet } from 'react-native';

export const shared = StyleSheet.create({
  safeScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbWrapper: {
    borderRadius: radii.sm,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: colors.cardImageBg,
  },
});
