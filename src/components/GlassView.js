// Liquid Glass wrapper, falls back to plain View pre-iOS 26
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
