import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Endpoints';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import { setUser } from '@/slices/userSlice';


export default function EntryScreen() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

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



      const response = await axios.post(
        `${API_URL}/auth/me`,
        {}, // No data to send in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );




      dispatch(setUser(response.data.user))
      setIsAuthenticated(true);

      router.navigate('/(tabs)/feed');

    } catch (error) {

      router.navigate('/welcome');
    }
  }



  return (

    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Fanclub</ThemedText>
    </SafeAreaView>

  );
}

