import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import ProfileImageDisplay from './ProfileImageDisplay';

interface NotificationViewDisplay {
    id: string;
    receiver_id: number | string;
    sender_id: number | string;
    pointer_type: string;
    pointer_id: number | string;
    created_at: string | null;
    is_read: boolean;
    sender_username: string,
    sender_image: string | null;
    onSelect: (notifId: string) => void;
    canSelect: boolean;
}

export default function NotificationViewDisplay({ id, receiver_id, sender_id, pointer_type, pointer_id, created_at, is_read, sender_username, sender_image, onSelect, canSelect }: NotificationViewDisplay) {
    const [isSelected, setIsSelected] = useState(false);

    const handleSelect = () => {
        setIsSelected(!isSelected);
        onSelect(id);
    };
    const getNotificationIcon = () => {
        switch (pointer_type) {
            case 'comment': return 'message-circle';
            case 'comment_reply': return 'message-circle';
            case 'like': return 'heart';
            case 'follow': return 'user-plus';
            default: return 'bell';
        }
    };

    const getNotificationText = () => {
        switch (pointer_type) {
            case 'comment': return 'commented on your post';
            case 'comment_reply': return 'replied to your comment';
            case 'like': return 'liked your post';
            case 'follow': return 'started following you';
            default: return 'sent you a notification';
        }
    };

    const getNotificationPointer = () => {
        switch (pointer_type) {
            case 'comment': return 'feed';
            case 'comment_reply': return 'feed';
            case 'like': return 'feed';
            case 'follow': return 'profile';
        }
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {canSelect ? (
            <TouchableOpacity 
                onPress={handleSelect}
                style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: isSelected ? '#ffffffff' : Colors.general.semiVisibleText,
                    backgroundColor: isSelected ? '#ffffffff' : 'transparent',
                    borderRadius: 4,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
            
                {isSelected && <ThemedText type='default' style={{color: '#000', lineHeight: 16 }}><Feather name='check'/></ThemedText>}
            </TouchableOpacity>
            ) : (<></>)
            }

            <Link href={`/feed/${pointer_id}`} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'column', gap: 20, borderWidth: 1, padding: 10, borderLeftColor: is_read ? (Colors.general.readNotif) : (Colors.general.unreadNotif)}}>
                    <ProfileImageDisplay size={50} image={sender_image}></ProfileImageDisplay>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedText type='defaultSemiBold'>{sender_username} </ThemedText><ThemedText type='default'>{getNotificationText()}</ThemedText>
                    </View>
                </View>
            </Link>
        </View>
    )
}