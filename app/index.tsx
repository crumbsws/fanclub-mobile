import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';
import { useRouter } from 'expo-router';
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
      const response = await axios.post('http://192.168.1.115:5000/auth/me');
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

