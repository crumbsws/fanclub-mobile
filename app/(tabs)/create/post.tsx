import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import BackBlockButton from '@/components/ui/BackBlockButton';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Endpoints';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Create() {

  const [blocked, setBlocked] = useState<boolean>(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
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

  const router = useRouter();


  async function createPost() {

    setIsLoading(true);
    setBlocked(true);
    const token = await SecureStore.getItemAsync('jwt_token');


    if (!token || token.length < 1) {
      return;
    }

    const images = image ? [image] : [];
    const formData = new FormData();
    images.forEach((item, index) => formData.append("images", {
      uri: item.uri,
      type: item.type || 'image/jpeg',
      name: item.fileName || `image_${index}.jpg`,
    } as any));
    formData.append('context', context)

    try {
      const response = await axios.post(`${API_URL}/content/create`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
 
      router.push(`/(tabs)/feed/${response.data.post_id}`)
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


    } finally {
      setBlocked(false);
      setIsLoading(false);
    }
  }



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, 
      aspect: [4, 3],
      quality: 1,
    });



    if (!result.canceled) {
      const asset = result.assets[0]
      setImage(asset);
    }
  };


  return (

    <>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 1, padding: 40, flexDirection: 'column', gap: 20 }}>
          <TextInput style={styles.createInput} placeholder="Add context (optional)" value={context} maxLength={20} onChangeText={newContext => setContext(newContext)} />

          {image == null ? (
            <View style={styles.uploadBox}>

              <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>


                <Feather name='camera' size={48} color={'white'} />
                <ThemedText type='subtitle'>Upload Image</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={{ width: '100%', maxHeight: '50%' }}>
              <Image
                source={{ uri: image.uri }}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
              />
            </TouchableOpacity>
          )}

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
