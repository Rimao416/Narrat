import { Tabs } from 'expo-router';
import React from 'react';
import { Home, BookOpen, Users, Compass, User } from 'lucide-react-native';

import { useThemeStore } from '../../store/themeStore';
import { getThemeColors, COLORS } from '../../constants/Colors';

export default function TabLayout() {
  const { isDarkMode } = useThemeStore();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: themeColors.textMuted,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
        },
        headerStyle: {
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border,
        },
        headerTintColor: themeColors.textMain,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Communauté',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Découvrir',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
