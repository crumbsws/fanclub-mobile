import { ThemedText } from '@/components/ThemedText';
import NotificationViewDisplay from '@/components/ui/NotificationViewDisplay';
import { API_URL, CDN_URL } from '@/constants/Endpoints';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  sender: User;
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


  if (isNotificationsLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!isNotificationsLoading && !notifications) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>No post found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {notifications.map((notificationsData, index) => (

        <NotificationViewDisplay key={index} sender_image={notificationsData.sender.image === null ? (null) : (CDN_URL + '/' + notificationsData.sender.image)} id={notificationsData.id} receiver_id={notificationsData.receiver_id} sender_id={notificationsData.sender_id} is_read={notificationsData.is_read} created_at={notificationsData.created_at} sender_username={notificationsData.sender.username} pointer_id={notificationsData.pointer_id} pointer_type={notificationsData.pointer_type} />

      ))}

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
