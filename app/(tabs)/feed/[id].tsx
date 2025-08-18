import { StyleSheet } from 'react-native';
import { Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { API_URL } from '@/constants/Endpoints';
import axios from 'axios';
import PostViewDisplay from '@/components/ui/PostViewDisplay';
import { CDN_URL } from "@/constants/Endpoints";
import BackBlockButton from '@/components/ui/BackBlockButton';

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

export default function Post() {

  const local = useLocalSearchParams();
  const id = local.id;
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);



  useEffect(() => {
    getPost()
  }, [id]);



  const getPost = async () => {
    setIsLoading(true);



    try {

      const token = await SecureStore.getItemAsync('jwt_token');




      const response = await axios.get(
        `${API_URL}/content/post/id/${id}`,
        // No data to send in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost(response.data.post);






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

  if (!isLoading && !post) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>No post found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (post) {
    return (

      <>
        <SafeAreaView style={{ flex: 1 }}>

          
            
              <PostViewDisplay comments={post.comments} username={post.author.username} post_id={post.id} author_id={post.author.id} profile_image={post.author.image === null ? (null) : (CDN_URL + '/' + post.author.image)} created_at='' image={CDN_URL + '/' + post.attachments[0].s3_key} context={post.context} />



           



          

          



          <View style={styles.backButtonContainer}>
            <BackBlockButton />
          </View>
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
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
  },


});
