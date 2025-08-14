import ProfileImageDisplay from './ProfileImageDisplay';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, TextInput } from 'react-native'
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@/constants/Endpoints';
import { Feather } from '@expo/vector-icons';
import { setUser } from '@/slices/userSlice';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';

interface ProfileViewDisplayProps {
    id: string,
    username: string,
    email: string,
    created_at: string,
    biography: string | null,
    school: string | null,
    level: number,
    image: string | null
}



export default function ProfileViewDisplay({ id, username, image, created_at, level, email, biography, school }: ProfileViewDisplayProps) {

    const user = useAppSelector((state) => state.user);
    const [visible, setVisible] = useState(false);
    const [newBiography, setNewBiography] = useState(biography ?? '');
    const [newSchool, setNewSchool] = useState(school ?? '');
    const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [message, setMessage] = useState('');

    const dispatch = useAppDispatch();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const asset = result.assets[0]
            setNewImage(asset);
        }
    };


    async function updateProfile() {

        setIsLoading(true);
        setBlocked(true);
        const token = await SecureStore.getItemAsync('jwt_token');


        if (!token || token.length < 1) {
            return;
        }

        const formData = new FormData();

        formData.append('biography', newBiography)
        formData.append('school', newSchool)
        if (newImage) {
            const imageFile = {
                uri: newImage.uri,
                type: newImage.mimeType || 'image/jpeg', // Default to jpeg if mimeType is undefined
                name: newImage.fileName || `profile_image_${Date.now()}.jpg`, // Generate name if not provided
            } as any;

            formData.append('image', imageFile);
        }

        try {
            const response = await axios.put(`${API_URL}/profile/update`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            dispatch(setUser(response.data.user))
            setVisible(false);
            setNewImage(null);
            setNewSchool('');
            setNewBiography('');


        }
        catch (error: any) {

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setMessage('Invalid request. Please check your input.');
                        break;
                    case 401:
                        setMessage('Unauthorized. Please log in again.');
                        break;
                    case 500:
                        setMessage('Server error. Please try again later.');
                        break;
                    default:
                        setMessage('An unexpected error occurred.');
                        break;
                }
            }
            else if (error.request) {
                setMessage('No response received from server.');
            }


        } finally {
            setBlocked(false);
            setIsLoading(false);
        }
    }


    return (
        <ThemedView style={{ maxHeight: 400, minHeight: 350, width: '100%', flexDirection: 'column', gap: 15, alignItems: 'center' }}>


            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}

                onRequestClose={() => setVisible(false)}
            >

                <ThemedView style={styles.modalView}>

                    <ThemedText type='defaultSemiBold'>Edit Profile</ThemedText>
                    <TouchableOpacity onPress={pickImage} >
                        <ProfileImageDisplay size={150} image={newImage ? newImage.uri : image}></ProfileImageDisplay>
                    </TouchableOpacity>


                    <ThemedView style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                        <TextInput
                            style={[styles.textInput, styles.paragraph]}
                            onChangeText={newBiography => setNewBiography(newBiography)}
                            value={newBiography}
                            placeholder='Biography'
                            multiline={true}
                            blurOnSubmit={true}
                            textAlignVertical="top"
                            maxLength={100}


                        />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={newSchool => setNewSchool(newSchool)}
                            value={newSchool}
                            placeholder='School'

                        />
                        {message ? <Text style={{ color: 'red', fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}

                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={() => setVisible(false)}>
                                <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => updateProfile()} style={[styles.button, blocked && styles.disabledButton]} disabled={blocked}>
                                <ThemedText type="defaultSemiBold" style={[styles.buttonText, blocked && styles.disabledText]}>{isLoading ? <Feather name='loader' /> : 'Save'}</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>

                </ThemedView>

            </Modal>

            <ProfileImageDisplay size={150} image={image}></ProfileImageDisplay>
            <ThemedText type='subtitle'>{username}</ThemedText>

            {user.user?.id === id ? (
                <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={() => setVisible(true)}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>Edit</ThemedText>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button}>
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>Follow</ThemedText>
                </TouchableOpacity>
            )
            }

            {biography !== null ? (
            <ThemedView style={{ width: '80%' }}>
                <ThemedText type='default' >{biography}</ThemedText>
            </ThemedView>
            ) : (<></>)}

            {school !== null ? (
            <ThemedView style={styles.schoolBox}>
                <ThemedText type='default'>{school}</ThemedText>
            </ThemedView>
            ) : (<></>)}


        </ThemedView>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 5,
        width: '40%',
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        height: 50
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
    },

    modalView: {
        flexDirection: 'column',
        gap: 20,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',

    },
    textInput: {
        height: 60,
        borderWidth: 1,
        padding: 15,
        borderColor: '#fff',
        borderRadius: 10,
        color: '#fff'
    },

    paragraph: {
        height: 180,
    },

    schoolBox: {
        justifyContent: 'center',
        padding: 10,
        width: '90%',
        borderColor: '#4c4c4c',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#1C1C1C',
        height: 70,
    },
})