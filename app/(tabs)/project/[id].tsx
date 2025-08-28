import { ThemedText } from '@/components/ThemedText';
import PostGalleryContainer from '@/components/ui/PostGalleryContainer';
import ProjectViewDisplay from '@/components/ui/ProjectViewDisplay';
import { API_URL } from '@/constants/Endpoints';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post, Project } from '../../../types/types';



export default function ViewProject() {

  const local = useLocalSearchParams();
  const id = local.id;
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [project, setProject] = useState<Project | null>(null);



  useEffect(() => {
    getProject()
    getPosts()
  }, [id]);



  const getPosts = async () => {
    setIsPostsLoading(true);



    try {

      const token = await SecureStore.getItemAsync('jwt_token');




      const response = await axios.get(
        `${API_URL}/content/post/project/${id}`,
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


  const getProject = async () => {
    setIsProjectLoading(true);



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
      setIsProjectLoading(false);
    }
  }


  if (isProjectLoading || isPostsLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!isProjectLoading && !project) {
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

          <ProjectViewDisplay id={project.id} name={project.name} description={project.description} created_at={project.created_at} author_id={project.author_id} category={project.category} is_complete={project.is_complete} username={project.author.username} profile_image={project.author.image} members={project.members} /> 
          <PostGalleryContainer posts={posts} showProfileImage={true} />

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
