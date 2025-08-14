import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/redux/useAppSelector';

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
          <ThemedText type="subtitle">{ greeting + ', ' + user.user?.username}</ThemedText>

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
