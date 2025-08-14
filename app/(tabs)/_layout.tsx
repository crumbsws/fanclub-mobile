import { Tabs } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform } from 'react-native';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
import ProfileImageDisplay from '@/components/ui/ProfileImageDisplay';
import { CDN_URL } from '@/constants/Endpoints';

//dont do whatever the fuck these do
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useAppSelector((state) => state.user);

  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background, borderTopColor: 'transparent', ...Platform.select({
            ios: {
              position: 'absolute',
            }
          })
        },

      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Feather name={'film'} color={color} size={25} />
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Feather name={'bell'} color={color} size={25} />,
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
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Feather name={'search'} color={color} size={25} />,
        }}
      />

      <Tabs.Screen
        name="profile/[id]"
        initialParams={{ id: user.user?.id }}
        options={{
          title: 'Profile',
          tabBarIcon: () => (
            <ProfileImageDisplay image={user.user?.image === null ? (null) : (CDN_URL + '/' + user.user?.image)} size={25} />
          ),
        }}
      />







    </Tabs>
  );
}
