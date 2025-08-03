import { StyleSheet, TextInput, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import React from 'react';

import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import BackBlockButton from '@/components/ui/BackBlockButton';
import axios from 'axios';
import { API_URL } from '@/constants/Endpoints';
import * as SecureStore from 'expo-secure-store';

export default function Create() {

  const [blocked, setBlocked] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [context, setContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);


  useEffect(() => {

    if (image) {
      setBlocked(false);
    } else {
      setBlocked(true);
    }
  }, [image]);



  async function createPost() {

    setIsLoading(true);
    const token = await SecureStore.getItemAsync('jwt_token');


    if (!token || token.length < 1) {
      return;
    }

    const images = image ? [image] : [];
    const formData = new FormData();
    images.forEach((item) => formData.append("files", item));

    try {
      const response = await axios.post(`${API_URL}/content/create`, {

        context: context
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      setIsLoading(false);
      setImage(null);
      setContext('');


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

      setIsLoading(false);

    }
  }



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });



    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (

    <>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 1, alignItems: 'flex-start', padding: 40, flexDirection: 'column', gap: 40 }}>
          <TextInput style={styles.createInput} placeholder="Add context (optional)" value={context} maxLength={20} onChangeText={newContext => setContext(newContext)} />

          {image == null ? (
            <View style={styles.uploadBox}>

              <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>


                <Feather name='camera' size={48} color={'white'} />
                <ThemedText>Upload Image</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={{ width: '100%', maxHeight: '50%' }}>
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
            </TouchableOpacity>
          )}

          <View style={{ width: '100%', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>

            {message ? <Text style={{ color: 'red', fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}
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
    borderColor: '#4c4c4c',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
    height: 200,
  },

  createInput: {
    color: '#fff',
    fontSize: 20,
    width: '100%',
  },

});
