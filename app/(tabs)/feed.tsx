import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  return (
 
    <>
    <SafeAreaView style={{ flex: 1}}>





      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">FEED</ThemedText>
        <ThemedText type="defaultSemiBold">Frame the Now</ThemedText>

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
