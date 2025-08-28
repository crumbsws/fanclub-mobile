import { ThemedText } from '@/components/ThemedText';
import PostViewDisplay from '@/components/ui/PostViewDisplay';
import { API_URL, CDN_URL } from '@/constants/Endpoints';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post } from '../../../types/types';

export default function ViewPost() {

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
