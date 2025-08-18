import ProfileImageDisplay from './ProfileImageDisplay';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native'
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Platform } from 'react-native';

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

    //FIX: PAGE OVERSCROLLING ON INITIAL LOAD
    const user = useAppSelector((state) => state.user);
    const [visible, setVisible] = useState(false);
    const [newBiography, setNewBiography] = useState(biography ?? '');
    const [newSchool, setNewSchool] = useState(school ?? '');
    const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');

    const [followBlocked, setFollowBlocked] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const dispatch = useAppDispatch();
    const isFollowingState = user.user?.following?.some(u => u.id === id) ?? false;

    const [isFollowing, setIsFollowing] = useState(isFollowingState);

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
                        setProfileMessage('Invalid request. Please check your input.');
                        break;
                    case 401:
                        setProfileMessage('Unauthorized. Please log in again.');
                        break;
                    case 500:
                        setProfileMessage('Server error. Please try again later.');
                        break;
                    default:
                        setProfileMessage('An unexpected error occurred.');
                        break;
                }
            }
            else if (error.request) {
                setProfileMessage('No response received from server.');
            }


        } finally {
            setBlocked(false);
            setIsLoading(false);
        }
    }




    async function followUser() {


        setFollowBlocked(true);
        setIsFollowLoading(true);
        const token = await SecureStore.getItemAsync('jwt_token');


        if (!token || token.length < 1) {
            return;
        }


        try {
            const response = await axios.post(`${API_URL}/follow/follow`,
                {
                    id: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );


            setIsFollowing(true);


        }
        catch (error: any) {


        } finally {
            setFollowBlocked(false);
            setIsFollowLoading(false);

        }
    }

    async function unfollowUser() {


        setFollowBlocked(true);
        setIsFollowLoading(true);
        const token = await SecureStore.getItemAsync('jwt_token');


        if (!token || token.length < 1) {
            return;
        }


        try {
            const response = await axios.delete(`${API_URL}/follow/unfollow`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    id: id
                }
            });

            setIsFollowing(false);





        }
        catch (error: any) {


        } finally {
            setFollowBlocked(false);
            setIsFollowLoading(false);

        }
    }















    return (
        <ThemedView style={{ height: 'auto', width: '100%', flexDirection: 'column', gap: 15, alignItems: 'center' }}>


            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}

                onRequestClose={() => setVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>

                    <SafeAreaView style={{ flex: 1 }}>
                        <ThemedView style={styles.modalView}>
                            <ScrollView

                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.editContentView}>


                                    <ThemedText type='defaultSemiBold'>Edit Profile</ThemedText>
                                    <TouchableOpacity onPress={pickImage} >
                                        <ProfileImageDisplay size={150} image={newImage ? newImage.uri : image}></ProfileImageDisplay>
                                    </TouchableOpacity>
                                    {newImage && (
                                        <TouchableOpacity onPress={() => setNewImage(null)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Feather name="trash-2" size={16} color={Colors.general.error} />
                                            <ThemedText type='default' style={{ color: Colors.general.error }}> Remove</ThemedText>
                                        </TouchableOpacity>
                                    )}



                                    <ThemedView style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                                        <View >
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
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <ThemedText type='default' style={{ color: Colors.general.semiVisibleText, fontSize: 10 }}>{newBiography.length}/100</ThemedText>
                                            </View>
                                        </View>

                                        <TextInput
                                            style={styles.textInput}
                                            onChangeText={newSchool => setNewSchool(newSchool)}
                                            value={newSchool}
                                            placeholder='School'

                                        />
                                        {profileMessage ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{profileMessage}</Text> : <Text style={{ fontSize: 10 }} />}

                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={() => setVisible(false)}>
                                                <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>Cancel</ThemedText>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => updateProfile()} style={[styles.button, blocked && styles.disabledButton]} disabled={blocked}>
                                                <ThemedText type="defaultSemiBold" style={[styles.buttonText, blocked && styles.disabledText]}>{isLoading ? <Feather name='loader' /> : 'Save'}</ThemedText>
                                            </TouchableOpacity>
                                        </View>
                                    </ThemedView>
                                </View>
                            </ScrollView>
                        </ThemedView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </Modal>

            <ProfileImageDisplay size={150} image={image}></ProfileImageDisplay>
            <ThemedText type='subtitle'>{username}</ThemedText>

            {user.user?.id === id ? (
                <TouchableOpacity
                    style={[styles.button, styles.disabledButton]}
                    onPress={() => setVisible(true)}
                >
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>
                        Edit
                    </ThemedText>
                </TouchableOpacity>
            ) : isFollowing ? (
                <TouchableOpacity onPress={() => unfollowUser()} style={[styles.button, styles.disabledButton]} disabled={followBlocked}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>{isFollowLoading ? <Feather name='loader' /> : 'Unfollow'}</ThemedText>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => followUser()} style={[styles.button, followBlocked && styles.disabledButton]} disabled={followBlocked}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, blocked && styles.disabledText]}>{isFollowLoading ? <Feather name='loader' /> : 'Follow'}</ThemedText>
                </TouchableOpacity>
            )}





            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {school !== null ? (
                    <ThemedView style={styles.chipBox}>
                        <Feather name="award" size={20} color={Colors.general.schoolChip} style={{ marginRight: 6 }} /><ThemedText type='default'>{school}</ThemedText>
                    </ThemedView>
                ) : (<></>)}


                <ThemedView style={styles.chipBox}>
                    <Feather name="zap" size={20} color={Colors.general.levelChip} style={{ marginRight: 6 }} /><ThemedText type='default'>Level {level}</ThemedText>
                </ThemedView>
            </View>


            {biography !== null ? (
                <ThemedView style={{ width: '80%', borderBottomColor: Colors.general.semiVisibleText, borderWidth: 1, paddingBottom: 10 }}>
                    <ThemedText type='default' >{biography}</ThemedText>
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

        width: '100%',
        minHeight: '100%',

    },
    editContentView: {

        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingTop: 20,
        paddingBottom: 40,

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

    chipBox: {
        borderWidth: 1,
        width: 'auto',
        paddingHorizontal: 5,
        borderColor: Colors.general.semiVisibleText,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        height: 40,
        maxWidth: '80%'
    },
})