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

const Tab = createNativeBottomTabNavigator();

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0a0a1a',
    card: '#0d0d1a',
    border: 'rgba(255,255,255,0.08)',
    primary: '#f0c040',
    text: '#e8e8f0',
  },
};

function AppTabs() {
  const { savedDecks } = useDeckContext();
  const badgeCount = savedDecks.length > 0 ? savedDecks.length : undefined;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f0c040',
        tabBarInactiveTintColor: '#999',
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
            <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
            <AppTabs />
          </NavigationContainer>
        </DeckProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
