import { Tabs } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
//dont do whatever the fuck these do
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background, borderTopColor: 'transparent' },
      }}>

      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Feather name={'film'} color={color} size={25}/>,
        }}
      />

      <Tabs.Screen
        name="fanclub"
        options={{
          title: 'Fanclub',
          tabBarIcon: ({ color }) => <Feather name={'users'} color={color} size={25}/>,
        }}
      />

      <Tabs.Screen
        name='create'
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <Feather name={'plus'} color={color} size={25} />,

        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Feather name={'bell'} color={color} size={25}/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Feather name={'search'} color={color} size={25}/>,
        }}
      />


    </Tabs>
  );
}
