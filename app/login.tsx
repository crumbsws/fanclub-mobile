import { ThemedText } from '@/components/ThemedText';
import BackBlockButton from '@/components/ui/BackBlockButton';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Endpoints';

import { setUser } from '@/slices/userSlice';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';

export default function LoginScreen() {

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForwardBlocked, setIsForwardBlocked] = useState(true);
  const router = useRouter();

  const dispatch = useAppDispatch();




  useEffect(() => {
   
    const blocked = identifier.length < 3 || password.length < 8;
    setIsForwardBlocked(blocked);
    setMessage(''); 
  } , [identifier, password]);

  const Login = async () => {
    setIsForwardBlocked(true);
    setIsLoading(true);
    
    try {

      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier: identifier,
        password: password,
      });

      
      try {
        await SecureStore.setItemAsync('jwt_token', response.data.token);
      } catch (e) {
        setMessage('An error occurred while saving the token.');
        setIsLoading(false);
        return;
      }

      dispatch(setUser(response.data.user))

      router.navigate('/(tabs)/feed');
      

    } catch (error: any) {

      if(error.response) {
        switch (error.response.status) {
          case 400:
            setMessage('Invalid request. Please check your input.');
            break;
          case 401:
            setMessage('Incorrect username or password.');
            break;
          case 403:
            setMessage('Your account is not allowed to login.');
            break;
          case 404:
            setMessage('User not found. Please register first.');
            break;
          case 500:
            setMessage('Server error. Please try again later.');
            break;
          default:
            setMessage('Login failed. Please try again.');
        } 
      }
      else if (error.request) {
        setMessage('No response received from server.');
      }


      
    }
    finally {
      setIsLoading(false);
      setIsForwardBlocked(false);
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
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, isForwardBlocked && styles.disabledText]}>{isLoading ? <Feather name='loader' /> : 'Proceed'}</ThemedText>
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

