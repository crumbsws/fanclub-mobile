import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { API_URL } from '@/constants/Endpoints';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  image: string | null;
}

interface Notification {
  id: string;
  receiver_id: string;
  sender_id: string;
  pointer_type: string;
  pointer_id: string;
  created_at: string; 
  is_read: boolean;
  sender?: User;
}

export default function Notifications() {
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotifications = async () => {
    setIsNotificationsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('jwt_token');
      const response = await axios.get(
        `${API_URL}/notification/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  // ⬇ Run once on mount
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isNotificationsLoading ? (
          <ThemedText type="title">Loading...</ThemedText>
        ) : (
          <ThemedText type="title">
            {notifications.length > 0 
              ? notifications[0].receiver_id 
              : "No notifications"}
          </ThemedText>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 15,
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
});
