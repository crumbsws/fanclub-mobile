import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import PostGalleryDisplay from '@/components/ui/PostGalleryDisplay';
import ProfileViewDisplay from '@/components/ui/ProfileViewDisplay';
import { API_URL, CDN_URL } from '@/constants/Endpoints';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
import axios from 'axios';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
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
}

interface ImageAuthorPair {
  author: Author,
  s3_key: string,
  id: string
}

interface User {
  id: string,
  username: string,
  email: string,
  school: string,
  biography: string,
  created_at: string,
  level: number,
  image: string | null
}

export default function Profile() {


  const user = useAppSelector((state) => state.user);

  const local = useLocalSearchParams();
  const id = local.id;
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [leftColumn, setLeftColumn] = useState<ImageAuthorPair[]>([]);
  const [rightColumn, setRightColumn] = useState<ImageAuthorPair[]>([]);

  useEffect(() => {



    const left: ImageAuthorPair[] = [];
    const right: ImageAuthorPair[] = [];

    const imagePairs: ImageAuthorPair[] = [];


    posts?.forEach(post => {
      post?.attachments?.forEach(attachment => {
        if (attachment.file_type?.includes('image')) {
          imagePairs.push({ author: post.author, s3_key: attachment.s3_key, id: post.id });
        }
      });
    })

    imagePairs.forEach((imageData: ImageAuthorPair, index: number) => {
      if (index % 2 === 0) {
        left.push(imageData);
      } else {
        right.push(imageData);
      }
    })


    setLeftColumn(left);
    setRightColumn(right);



  }, [posts]);

useFocusEffect(
  useCallback(() => {
    // Reset posts state when id changes
    setPosts([]);
    setLeftColumn([]);
    setRightColumn([]);
    
    if (user.user?.id === id) {
      setProfile(user.user);
    } else {
      getProfile();
    }
    getPosts();
  }, [id, user.user]) 
);

  const getPosts = async () => {
    setIsPostsLoading(true);



    try {

      const token = await SecureStore.getItemAsync('jwt_token');




      const response = await axios.get(
        `${API_URL}/content/post/author/${id}`,
        // No data to send in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.posts);





    } catch (error) {


    } finally {
      setIsPostsLoading(false);
    }
  }

  const getProfile = async () => {
    setIsProfileLoading(true);



    try {

      const token = await SecureStore.getItemAsync('jwt_token');




      const response = await axios.get(
        `${API_URL}/profile/id/${id}`,
        // No data to send in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data.user);





    } catch (error) {


    } finally {
      setIsProfileLoading(false);
    }
  }

  if (isPostsLoading || isProfileLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }


  if( profile !== null ) return (

    <>
      <SafeAreaView style={{ flex: 1 }}>

        <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
          <ProfileViewDisplay id={profile.id} username={profile.username} email={profile.email} created_at={profile.created_at} level={profile.level} image={profile.image === null ? (null) : (CDN_URL + '/' + profile.image)} biography={profile.biography} school={profile.school} />
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 60 }}>
            <View style={styles.column}>
              {leftColumn.map((imageData, index) => (

                  <PostGalleryDisplay key={index} id={imageData.id} image={CDN_URL + '/' + imageData.s3_key} profile_image={imageData.author.image === null ? (null) : (CDN_URL + '/' + imageData.author.image)} showProfileImage={false} />

              ))}
            </View>
            <View style={styles.column}>
              {rightColumn.map((imageData, index) => (

                  <PostGalleryDisplay key={index} id={imageData.id} image={CDN_URL + '/' + imageData.s3_key} profile_image={imageData.author.image === null ? (null) : (CDN_URL + '/' + imageData.author.image)} showProfileImage={false} />

              ))}
            </View>
          </View>
        </ScrollView>




      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 5,
    gap: 20
  }
});
