import React from 'react';
import { View } from 'react-native';

export const SafeAreaView = ({ children, style }) =>
  React.createElement(View, { style }, children);

export const SafeAreaProvider = ({ children }) =>
  React.createElement(View, { style: { flex: 1 } }, children);

export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
