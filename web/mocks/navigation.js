import React, { useState, createContext, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const NavContext = createContext({ navigate: () => {} });

export const useNavigation = () => useContext(NavContext);
export const useRoute = () => ({ params: {} });

export const DarkTheme = {
  dark: true,
  colors: {
    primary: '#0a84ff',
    background: '#000',
    card: '#1c1c1e',
    text: '#fff',
    border: '#38383a',
    notification: '#ff453a',
  },
};

export function NavigationContainer({ children, theme }) {
  return React.createElement(View, { style: { flex: 1, backgroundColor: theme?.colors?.background || '#000' } }, children);
}

export function createNativeBottomTabNavigator() {
  function Screen() { return null; }
  Screen.displayName = 'Screen';

  function Navigator({ children, screenOptions }) {
    const screens = React.Children.toArray(children).filter(c => c.type === Screen);
    const [activeTab, setActiveTab] = useState(0);

    const navigate = (name) => {
      const idx = screens.findIndex(s => s.props.name === name);
      if (idx >= 0) setActiveTab(idx);
    };

    const active = screens[activeTab];
    const Comp = active?.props?.component;
    const activeTint = screenOptions?.tabBarActiveTintColor || '#007AFF';
    const inactiveTint = screenOptions?.tabBarInactiveTintColor || '#999';

    return React.createElement(NavContext.Provider, { value: { navigate, goBack: () => {} } },
      React.createElement(View, { style: { flex: 1 } },
        React.createElement(View, { style: { flex: 1 } },
          Comp ? React.createElement(Comp) : null
        ),
        React.createElement(View, { style: tabStyles.bar },
          screens.map((s, i) => {
            const opts = s.props.options || {};
            const isActive = i === activeTab;
            return React.createElement(Pressable, {
              key: s.props.name,
              style: tabStyles.tab,
              onPress: () => setActiveTab(i),
            },
              React.createElement(View, { style: [tabStyles.dot, isActive && { backgroundColor: activeTint }] }),
              React.createElement(Text, {
                style: [tabStyles.label, { color: isActive ? activeTint : inactiveTint }]
              }, opts.title || s.props.name),
              opts.tabBarBadge ? React.createElement(View, { style: tabStyles.badge },
                React.createElement(Text, { style: tabStyles.badgeText }, opts.tabBarBadge)
              ) : null
            );
          })
        )
      )
    );
  }

  return { Navigator, Screen };
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 50,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#0d0d1a',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#444',
    marginBottom: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: '25%',
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
