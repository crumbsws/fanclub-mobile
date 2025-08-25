import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import ProfileImageDisplay from '@/components/ui/ProfileImageDisplay';
import { CDN_URL } from '@/constants/Endpoints';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feed() {

  const user = useAppSelector((state) => state.user);


  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Hey there";
    } else if (hour >= 17 && hour < 21) {
      return "Wind down";
    } else {
      return "Nighty";
    }
  }

  const greeting = getGreeting();

  return (

    <>
      <SafeAreaView style={{ flex: 1 }}>





        <View style={{ flex: 1, alignItems: 'flex-start', padding: 40, flexDirection: 'column', gap: 40 }}>
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <ProfileImageDisplay size={50} image={user.user?.image === null ? null : (CDN_URL + '/' + user.user?.image)} />
            <ThemedText style={{ marginTop: 5 }} type="subtitle">{greeting + ', ' + user.user?.username}</ThemedText>
          </View>

        </View>

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 15,
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 20
  },

  buttonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center'
  }
});
