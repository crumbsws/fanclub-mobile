import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Endpoints';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import BackBlockButton from './BackBlockButton';
import CommentViewDisplay from './CommentViewDisplay';
import ProfileImageDisplay from './ProfileImageDisplay';

interface PostViewDisplayProps {
    username: string,
    profile_image: string | null,
    created_at: string,
    image: string,
    context: string | null
    comments: Comment[]
    post_id: string
    author_id: string
}

interface Comment {
    id: string;
    content: string;
    created_at: string | null;
    author: Author;
    parent_id: string | null;
}
interface Author {
    id: string;
    username: string;
    image: string | null;
}


export default function PostViewDisplay({ post_id, author_id, username, profile_image, created_at, image, context, comments }: PostViewDisplayProps) {

    const [content, setContent] = useState('');
    const [parent, setParent] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [message, setMessage] = useState('');
    const [localComments, setLocalComments] = useState<Comment[]>(comments);

    useEffect(() => {

        if (content) {
            setBlocked(false);
        } else {
            setBlocked(true);
        }
    }, [content]);

    async function createComment() {

        setIsLoading(true);
        setBlocked(true);
        const token = await SecureStore.getItemAsync('jwt_token');


        if (!token || token.length < 1) {
            return;
        }
        const formData = new FormData();
        formData.append('id', post_id)
        formData.append('content', content)
        formData.append('parent_id', parent)


        try {
            const response = await axios.post(`${API_URL}/content/comment`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            setMessage('')
            setParent('')
            setContent('')
            const newComment: Comment = response.data.comment;
            setLocalComments(prevComments => [newComment, ...prevComments]);
            Keyboard.dismiss()

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
        <>
            <ThemedView style={{ width: '100%', flexDirection: 'column', gap: 20, }}>

                <Modal
                    visible={visible}
                    animationType="slide"
                    transparent={true}

                    onRequestClose={() => setVisible(false)}
                >

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >

                        <TouchableOpacity
                            style={{
                                height: Platform.OS === 'ios' ? 200 : 160,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)'
                            }}
                            onPress={() => setVisible(false)}
                            activeOpacity={1}
                        />
                        <ThemedView style={styles.modalView}>
                            <ScrollView >
                                {localComments.filter(comment => comment.parent_id === null || comment.parent_id === undefined)
                                    .map((comment) => (
                                        <CommentViewDisplay
                                            key={comment.id}
                                            comment_id={comment.id}
                                            comments={localComments}
                                            onReply={setParent}
                                        />
                                    ))}
                            </ScrollView>

                        </ThemedView>

                        <ThemedView style={{ flexDirection: 'column', gap: 10, paddingBottom: Platform.OS === 'ios' ? 34 : 10, width: '100%', padding: 10 }}>

                            {message ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}
                            <View style={{ flexDirection: 'row', gap: 5, width: '100%' }}>
                                <TextInput onBlur={() => setParent('')} style={styles.commentInput} placeholder={parent ? `Replying to ${localComments.find(comment => comment.id === parent)?.author.username}` : 'Add comment'} value={content} maxLength={200} onChangeText={newContent => setContent(newContent)} />
                                <TouchableOpacity onPressIn={() => createComment()} style={[styles.button, blocked && styles.disabledButton]} disabled={blocked}>
                                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, blocked && styles.disabledText]}>{isLoading ? <Feather name='loader' /> : <Feather name='send' />}</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>
                    </KeyboardAvoidingView>
                </Modal>

                <View style={{ minHeight: 450, maxHeight: 650, width: '100%', borderRadius: 20, backgroundColor: Colors.general.missingMediaBackground }}>
                    <Image
                        source={{ uri: image }}


                    />

                    <View style={styles.backButtonContainer}>
                        <BackBlockButton />
                    </View>
                </View>


                <ThemedView style={{ flexDirection: 'row', paddingHorizontal: 8, gap: 10 }}>

                    <TouchableOpacity>
                        <Feather name='flag' size={28} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Feather name='message-circle' size={28} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 'auto' }}>
                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                            <ThemedText type='defaultSemiBold'>Add to project</ThemedText>
                            <Feather name='calendar' size={28} color={'white'} />

                        </View>
                    </TouchableOpacity>

                </ThemedView>

                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <ProfileImageDisplay size={50} image={profile_image}></ProfileImageDisplay>
                    <Link href={`/profile/${author_id}`} style={styles.profileText}>
                        <ThemedText type="defaultSemiBold">{username}</ThemedText>
                    </Link>
                    {context ?
                        (<ThemedText type='default' style={styles.profileText}>{context}</ThemedText>) : (<></>)
                    }
                </View>




            </ThemedView>

        </>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 15,
        height: 60,
        width: 60,
        backgroundColor: '#fff',
        borderRadius: 10
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
    profileText: {
        marginTop: 5,

    },
    commentInput: {
        height: 60,
        borderWidth: 1,
        padding: 15,
        borderColor: '#fff',
        borderRadius: 10,
        color: '#fff',
        flex: 1

    },
    modalView: {


        flexDirection: 'column',
        gap: 20,
        width: '100%',
        flex: 1,


    },
    backButtonContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
})