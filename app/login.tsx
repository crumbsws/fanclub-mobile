import { ThemedText } from '@/components/ThemedText';
import BackBlockButton from '@/components/ui/BackBlockButton';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForwardBlocked, setIsForwardBlocked] = useState(true);
  const router = useRouter();


  useEffect(() => {
   
    const blocked = identifier.length < 3 || password.length < 8;
    setIsForwardBlocked(blocked);
    setMessage(''); 
  } , [identifier, password]);

  const Login = async () => {
    setIsLoading(true);

    try {
      
      const response = await axios.post('http://192.168.1.115:5000/auth/login', {
        identifier: identifier,
        password: password,
      });

      setIsLoading(false);
      router.push('/(tabs)/explore');

    } catch (error) {

      setIsLoading(false);
      setMessage('Login failed.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">Login</ThemedText>

        <View style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>
          <TextInput
            style={styles.loginInput}
            onChangeText={newIdentifier => setIdentifier(newIdentifier)}
            defaultValue={identifier}
            placeholder="Username or E-Mail"

          />

          <TextInput
            style={styles.loginInput}
            onChangeText={newPassword => setPassword(newPassword)}
            defaultValue={password}
            secureTextEntry={true}
            placeholder="Password"
          />


          {message ? <Text style={{ color: 'red', fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}


          <View style={{ alignItems: 'center', gap: 20 }}>

            <TouchableOpacity onPress={() => Login()} style={[styles.button, isForwardBlocked && styles.disabledButton]} disabled={isForwardBlocked}>
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, isForwardBlocked && styles.disabledText]}>{isLoading ? <FontAwesome name='spinner' /> : 'Proceed'}</ThemedText>
            </TouchableOpacity>



            <BackBlockButton />
          </View>
        </View>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  loginInput: {
    height: 60,
    borderWidth: 1,
    padding: 15,
    borderColor: '#fff',
    borderRadius: 10,
    color: '#fff'
  },

  button: {
    borderWidth: 1,
    padding: 15,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    height: 60
},

disabledButton: {
    backgroundColor: '#000',
    borderColor: '#fff'
},

disabledText: {
    color: '#fff'
},



  buttonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center'
  }
});

