import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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

      const response = await axios.post('http://172.20.10.11:5000/auth/me', {
        token: token
      });
      if (response.status === 201) {

        setIsAuthenticated(true);
        
        router.push('/(tabs)/explore');
      }
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

