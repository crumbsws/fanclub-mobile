import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Endpoints';

export default function EntryScreen() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router= useRouter();

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
    



    try {
      
      const token = await SecureStore.getItemAsync('jwt_token');

      if (!token || token.length < 1) {
        router.push('/welcome'); // Redirect to welcome if no valid token
        
        return;
      }


      
      const response = await axios.post(`${API_URL}/auth/me`, {
        token: token
      });
      
      

      
      try {
        await SecureStore.setItemAsync('jwt_token', response.data.token);
        
      } catch (e) {
        router.push('/welcome');
        return;
      }



        setIsAuthenticated(true);
        
        router.push('/(tabs)/explore');
      
    } catch (error) {
      
      router.push('/welcome');
    }
  }



  return (
    
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">Fanclub</ThemedText>
      </SafeAreaView>
    
  );
}

