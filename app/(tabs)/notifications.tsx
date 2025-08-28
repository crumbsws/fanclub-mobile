import { ThemedText } from '@/components/ThemedText';
import NotificationViewDisplay from '@/components/ui/NotificationViewDisplay';
import { Colors } from '@/constants/Colors';
import { API_URL, CDN_URL } from '@/constants/Endpoints';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notification } from '../../types/types';

export default function Notifications() {
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isReadLoading, setIsReadLoading] = useState(false);
  const [selectionToggle, setSelectionToggle] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [readBlocked, setReadBlocked] = useState(false);
  const [deleteBlocked, setDeleteBlocked] = useState(false);



  async function readById() {
    setIsReadLoading(true);
    setReadBlocked(true);

    try {

      const token = await SecureStore.getItemAsync('jwt_token');

      const response = await axios.put(
        `${API_URL}/notifications/read/`,
        {
          ids: selected
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setNotifications(notifications.map(item =>
        selected.includes(item.id)
          ? { ...item, is_read: true }
          : item
      ));

    } catch (error) {


    } finally {
      setIsReadLoading(false);
      setReadBlocked(false)
    }
  }

  async function readAll() {
    setIsReadLoading(true);
    setReadBlocked(true);

    try {

      const token = await SecureStore.getItemAsync('jwt_token');

      const response = await axios.put(
        `${API_URL}/notifications/read/all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(notifications.map(item => ({ ...item, is_read: true })));

    } catch (error) {


    } finally {
      setIsReadLoading(false);
      setReadBlocked(false)
    }
  }


  async function deleteById() {
    setIsDeleteLoading(true);
    setDeleteBlocked(true);

    try {

      const token = await SecureStore.getItemAsync('jwt_token');

      const response = await axios.delete(
        `${API_URL}/notifications/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            ids: selected
          }
        }
      );

      setNotifications(notifications.filter(item => !selected.includes(item.id)));
    } catch (error) {


    } finally {
      setIsDeleteLoading(false);
      setDeleteBlocked(false)
    }
  }

  async function deleteAll() {
    setIsDeleteLoading(true);
    setDeleteBlocked(true);

    try {

      const token = await SecureStore.getItemAsync('jwt_token');

      const response = await axios.delete(
        `${API_URL}/notifications/delete/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setNotifications([])

    } catch (error) {


    } finally {
      setIsDeleteLoading(false);
      setReadBlocked(false)
    }
  }

  const setSelect = (notifId: string) => {
    if (selected.includes(notifId)) {
      setSelected(selected.filter(id => id !== notifId));
    } else {
      setSelected([...selected, notifId]);
    }
  };

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
          <ThemedText>No notifications yet</ThemedText>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'column', gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <TouchableOpacity onPress={() => setSelectionToggle(!selectionToggle)} style={[styles.buttonVeryThin, styles.disabledButton]} disabled={readBlocked || deleteBlocked} >
            <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>{!selectionToggle ? ('Select') : ('Unselect')}</ThemedText>
          </TouchableOpacity>
          {!selectionToggle ? (
            <>
              <TouchableOpacity style={[styles.buttonVeryThin]} onPress={() => readAll()} disabled={readBlocked}>
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, readBlocked && styles.disabledText]}>{isReadLoading ? <Feather name='loader' /> : 'Read All'}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonVeryThin, styles.deleteButton]} onPress={() => deleteAll()} disabled={deleteBlocked}>
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.deleteButtonText]}>{isDeleteLoading ? <Feather name='loader' /> : 'Delete All'}</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.buttonVeryThin]} onPress={() => readById()} disabled={readBlocked || (selectionToggle && selected.length === 0)} >
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, readBlocked && styles.disabledText]}>{isReadLoading ? <Feather name='loader' /> : 'Read'}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonVeryThin, styles.deleteButton]} onPress={() => deleteById()} disabled={deleteBlocked || (selectionToggle && selected.length === 0)}>
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.deleteButtonText]}>{isDeleteLoading ? <Feather name='loader' /> : 'Delete'}</ThemedText>
              </TouchableOpacity>
            </>
          )
          }
        </View>
        {notifications.map((notificationsData) => (

          <NotificationViewDisplay key={notificationsData.id} sender_image={notificationsData.sender.image === null ? (null) : (CDN_URL + '/' + notificationsData.sender.image)} id={notificationsData.id} receiver_id={notificationsData.receiver_id} sender_id={notificationsData.sender_id} is_read={notificationsData.is_read} created_at={notificationsData.created_at} sender_username={notificationsData.sender.username} pointer_id={notificationsData.pointer_id} pointer_type={notificationsData.pointer_type} onSelect={setSelect} canSelect={selectionToggle} />

        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonVeryThin: {
    borderWidth: 1,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    height: 30
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
  deleteButton: {
  backgroundColor: Colors.general.error,
  color: '#fff'
  },

  disabledText: {
    color: '#fff'
  },
  deleteButtonText: {
    color: '#fff'
  },

});
