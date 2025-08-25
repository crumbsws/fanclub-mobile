import { ThemedText } from '@/components/ThemedText';
import { API_URL } from '@/constants/Endpoints';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MediaAttachment {
  id: string;
  s3_key: string;
  file_type: string;
}

interface Author {
  id: string;
  username: string;
  image: string | null;
}

interface Post {
  id: string;
  context: string | null;
  author_id: number;
  attachments: MediaAttachment[];
  created_at: string | null;
  author: Author;
  comments: Comment[]
}

interface Comment {
  id: string;
  content: string;
  created_at: string | null;
  author: Author;
  parent_id: string | null;
}

export default function Project() {

  const local = useLocalSearchParams();
  const id = local.id;
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<Post | null>(null);



  useEffect(() => {
    getProject()
  }, [id]);



  const getProject = async () => {
    setIsLoading(true);



    try {

      const token = await SecureStore.getItemAsync('jwt_token');




      const response = await axios.get(
        `${API_URL}/project/id/${id}`,
        // No data to send in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(response.data.project);






    } catch (error) {


    } finally {
      setIsLoading(false);
    }
  }


  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoading && !project) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>No project found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (project) {
    return (

      <>
        <SafeAreaView style={{ flex: 1 }}>

          
            
              
        </SafeAreaView>
      </>
    );
  }

}



const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 15,
    height: 60,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 10
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
  }


});
