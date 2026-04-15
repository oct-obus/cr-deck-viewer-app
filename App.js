import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeckViewerScreen from './src/screens/DeckViewerScreen';
import SavedDecksScreen from './src/screens/SavedDecksScreen';
import { DeckProvider, useDeckContext } from './src/context/DeckContext';

const Tab = createBottomTabNavigator();

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
        headerShown: false,
        tabBarActiveTintColor: '#f0c040',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0d0d1a',
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Viewer"
        component={DeckViewerScreen}
        options={{ tabBarLabel: 'Viewer' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedDecksScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarBadge: badgeCount,
          tabBarBadgeStyle: badgeCount ? {
            backgroundColor: '#f0c040',
            color: '#0a0a1a',
            fontSize: 11,
            fontWeight: '700',
          } : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <DeckProvider>
      <NavigationContainer theme={appTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
        <AppTabs />
      </NavigationContainer>
    </DeckProvider>
  );
}
