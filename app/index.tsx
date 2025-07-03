import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';


export default function EntryScreen() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router= useRouter();

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
    try {
      const response = await axios.post('http://172.20.10.2:5000/auth/me');
      if (response.status === 201) {

        setIsAuthenticated(true);
        
        router.push('/(tabs)/explore');
      }
    } catch (error) {
      router.push('/welcome');
    }
  };

  return (
    
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">Fanclub</ThemedText>
      </SafeAreaView>
    
  );
}

