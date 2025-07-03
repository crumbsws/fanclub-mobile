import { Image } from 'expo-image';
import {  StyleSheet, Button, View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router= useRouter();

  return (
    <>
      <SafeAreaView style={{ flex: 1}}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 15}}>
        <Image
          source={require('@/assets/images/welcome-page-image.png')}
          style={{ width: 250, height: 250, borderRadius: 20, resizeMode: 'cover'}}
          
        />
    
        </View>

        <View style={{ flex: 1,justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 250 }}>
        <ThemedText type="title">Fanclub</ThemedText>
        <ThemedText type="defaultSemiBold">Frame the Now</ThemedText>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore')} style={styles.button}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore')} style={styles.button}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>
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



