import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import BackBlockButton from '@/components/ui/BackBlockButton';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Endpoints';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addOwnProject } from '@/slices/userSlice';

export default function Create() {

  const [blocked, setBlocked] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

    const dispatch = useAppDispatch();

  useEffect(() => {

    if (name) {
      setBlocked(false);
    } else {
      setBlocked(true);
    }
  }, [name]);

  const router = useRouter();


  async function createPost() {

    setIsLoading(true);
    setBlocked(true);
    const token = await SecureStore.getItemAsync('jwt_token');


    if (!token || token.length < 1) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name)

    try {
      const response = await axios.post(`${API_URL}/project/create`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

    router.push(`/(tabs)/project/${response.data.project.id}`);
    
      setName('');
      dispatch(addOwnProject(response.data.project));


    }
    catch (error: any) {

      if (error.response) {
        switch (error.response.status) {
          case 400:
            setMessage('Invalid request. Please check your input.');
            break;
          case 401:
            setMessage('Unauthorized. Please log in again.');
            break;
          case 500:
            setMessage('Server error. Please try again later.');
            break;
          default:
            setMessage('An unexpected error occurred.');
            break;
        }
      }
      else if (error.request) {
        setMessage('No response received from server.');
      }


    } finally {
      setBlocked(false);
      setIsLoading(false);
    }
  }




  return (

    <>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 1, padding: 40, flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput style={styles.createInput} placeholder="Project Name" value={name} maxLength={20} onChangeText={newName => setName(newName)} />

          <View style={{ width: '100%', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>

            {message ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}
            <TouchableOpacity onPress={() => createPost()} style={[styles.button, blocked && styles.disabledButton]} disabled={blocked}>
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, blocked && styles.disabledText]}>{isLoading ? <Feather name='loader' /> : 'Post'}</ThemedText>
            </TouchableOpacity>
            <BackBlockButton />
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
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    height: 60
  },

  buttonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center'
  },

  disabledButton: {
    backgroundColor: '#000',
    borderColor: '#fff'
  },

  disabledText: {
    color: '#fff'
  },

  uploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    borderColor: Colors.general.semiVisibleText,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.general.missingMediaBackground,
    height: 200,
  },

  createInput: {
    color: '#fff',
    fontSize: 20,
    width: '100%',
  },

});
