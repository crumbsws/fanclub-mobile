import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  //re add img
  return (
    <>
      <SafeAreaView style={{ flex: 1}}>





        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText type="title">Fanclub</ThemedText>
          <ThemedText type="defaultSemiBold">Frame the Now</ThemedText>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity onPress={() => router.push('/login')} style={styles.button}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Login</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/boarding')} style={styles.button}>
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



