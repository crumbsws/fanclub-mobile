import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import PostGalleryContainer from '@/components/ui/PostGalleryContainer';
import ProfileViewDisplay from '@/components/ui/ProfileViewDisplay';
import { API_URL, CDN_URL } from '@/constants/Endpoints';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
import axios from 'axios';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post, User } from '../../../types/types';

export default function Profile() {


  const user = useAppSelector((state) => state.user);

  const local = useLocalSearchParams();
  const id = local.id;
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<User | null>(null);



useFocusEffect(
  useCallback(() => {
    // Reset posts state when id changes
    setPosts([]);

    
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
          <ProfileViewDisplay id={profile.id} username={profile.username} email={profile.email} created_at={profile.created_at} level={profile.level} image={profile.image === null ? (null) : (CDN_URL + '/' + profile.image)} biography={profile.biography} school={profile.school} self_projects={profile.self_projects} projects={profile.projects} />
          <PostGalleryContainer posts={posts} showProfileImage={false} />
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
