import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import DeckViewerScreen from './src/screens/DeckViewerScreen';
import SavedDecksScreen from './src/screens/SavedDecksScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { DeckProvider, useDeckContext } from './src/context/DeckContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { colors } from './src/shared/theme';

const Tab = createNativeBottomTabNavigator();

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.accent,
    text: colors.textPrimary,
  },
};

function AppTabs() {
  const { savedDecks } = useDeckContext();
  const badgeCount = savedDecks.length > 0 ? savedDecks.length : undefined;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Viewer"
        component={DeckViewerScreen}
        options={{
          title: 'Viewer',
          tabBarIcon: Platform.OS === 'ios'
            ? { type: 'sfSymbol', name: 'rectangle.stack' }
            : undefined,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedDecksScreen}
        options={{
          title: 'Saved',
          tabBarIcon: Platform.OS === 'ios'
            ? { type: 'sfSymbol', name: 'bookmark.fill' }
            : undefined,
          tabBarBadge: badgeCount != null ? String(badgeCount) : undefined,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: Platform.OS === 'ios'
            ? { type: 'sfSymbol', name: 'gearshape' }
            : undefined,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <DeckProvider>
          <NavigationContainer theme={appTheme}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <AppTabs />
          </NavigationContainer>
        </DeckProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
