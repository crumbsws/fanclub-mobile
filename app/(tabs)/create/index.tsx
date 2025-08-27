import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <>
      <SafeAreaView style={{ flex: 1}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/create/post')}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>New Post</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.invertedButton]}
            onPress={() => router.push('/create/project')}
          >
            <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.invertedText]}>New Project</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 15,
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 20
  },

  buttonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center'
  },
    invertedButton: {
    backgroundColor: '#000',
    borderColor: '#fff'
  },

  invertedText: {
    color: '#fff'
  },
});
