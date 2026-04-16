// Shared Liquid Glass wrapper — falls back to plain View on non-iOS / older iOS.
import { View, Platform } from 'react-native';

let GlassViewComponent = View;
let liquidGlassSupported = false;

if (Platform.OS === 'ios') {
  try {
    const lg = require('@callstack/liquid-glass');
    if (lg.isLiquidGlassSupported) {
      GlassViewComponent = lg.LiquidGlassView;
      liquidGlassSupported = true;
    }
  } catch {}
}

export { GlassViewComponent as GlassView, liquidGlassSupported };
