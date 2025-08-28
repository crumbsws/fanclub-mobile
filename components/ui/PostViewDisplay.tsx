import { Colors } from '@/constants/Colors';
import { API_URL } from '@/constants/Endpoints';
import { useAppSelector } from '@/hooks/redux/useAppSelector';
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
import {Comment} from '@/types/types';

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



export default function PostViewDisplay({ post_id, author_id, username, profile_image, created_at, image, context, comments }: PostViewDisplayProps) {

    const [content, setContent] = useState('');
    const [parent, setParent] = useState('');
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [projectMenuVisible, setProjectMenuVisible] = useState(false);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [commentBlocked, setCommentBlocked] = useState(false);
    const [projectBlocked, setProjectBlocked] = useState(false);
    const [commentMessage, setCommentMessage] = useState('');
    const [localComments, setLocalComments] = useState<Comment[]>(comments);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState('');

    const user = useAppSelector((state) => state.user);
    const projects = useAppSelector((state) => state.user.user?.projects || []);
    const self_projects = useAppSelector((state) => state.user.user?.self_projects || [])

    useEffect(() => {
        if (content) {
            setCommentBlocked(false);
        } else {
            setCommentBlocked(true);
        }
    }, [content]);

    useEffect(() => {
        if (addingId) {
            setProjectBlocked(false);
        } else {
            setProjectBlocked(true);
        }
    }, [addingId]);

    const handleAddProject = (projectId: string) => {
        if (addingId === projectId) {
            setAddingId(null);
        } else {
            setAddingId(projectId);
        }
    };

    async function addPost() {
        setIsProjectLoading(true);
        setProjectBlocked(true);
        const token = await SecureStore.getItemAsync('jwt_token');

        if (!token || token.length < 1) {
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/project/add/post`, {
                post_id: post_id,
                project_id: addingId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            
            setProjectMessage('')
            setProjectMenuVisible(false)
            setAddingId(null)

        }
        catch (error: any) {
            
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setProjectMessage('Invalid request. Please check your input.');
                        break;
                    case 401:
                        setProjectMessage('Unauthorized. Please log in again.');
                        break;
                    case 500:
                        setProjectMessage('Server error. Please try again later.');
                        break;
                    default:
                        setProjectMessage('An unexpected error occurred.');
                        break;
                }
            }
            else if (error.request) {
                setProjectMessage('No response received from server.');
            }

            
        } finally {
            setProjectBlocked(false);
            setIsProjectLoading(false);
        }
    }

    async function createComment() {
        setIsCommentLoading(true);
        setCommentBlocked(true);
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
            setCommentMessage('')
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
                        setCommentMessage('Invalid request. Please check your input.');
                        break;
                    case 401:
                        setCommentMessage('Unauthorized. Please log in again.');
                        break;
                    case 500:
                        setCommentMessage('Server error. Please try again later.');
                        break;
                    default:
                        setCommentMessage('An unexpected error occurred.');
                        break;
                }
            }
            else if (error.request) {
                setCommentMessage('No response received from server.');
            }

        } finally {
            setCommentBlocked(false);
            setIsCommentLoading(false);
        }
    }

    return (
        <>
            <ThemedView style={{ width: '100%', flexDirection: 'column', gap: 20, }}>

                <Modal
                    visible={commentsVisible}
                    animationType="slide"
                    transparent={true}

                    onRequestClose={() => setCommentsVisible(false)}
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
                            onPress={() => setCommentsVisible(false)}
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

                            {commentMessage ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{commentMessage}</Text> : <Text style={{ fontSize: 10 }} />}
                            <View style={{ flexDirection: 'row', gap: 5, width: '100%' }}>
                                <TextInput onBlur={() => setParent('')} style={styles.commentInput} placeholder={parent ? `Replying to ${localComments.find(comment => comment.id === parent)?.author.username}` : 'Add comment'} value={content} maxLength={200} onChangeText={newContent => setContent(newContent)} />
                                <TouchableOpacity onPressIn={() => createComment()} style={[styles.buttonCube, commentBlocked && styles.disabledButton]} disabled={commentBlocked}>
                                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, commentBlocked && styles.disabledText]}>{isCommentLoading ? <Feather name='loader' /> : <Feather name='send' />}</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal
                    visible={projectMenuVisible}
                    animationType="slide"
                    transparent={true}

                    onRequestClose={() => setProjectMenuVisible(false)}
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
                            onPress={() => setProjectMenuVisible(false)}
                            activeOpacity={1}
                        />
                        <ThemedView style={styles.modalView}>

                            <ScrollView >
                                <View style={{ padding: 15, flexDirection: 'column', gap: 10 }}>
                                    <ThemedText type='subtitle'>Authored Projects</ThemedText>
                                    {self_projects && self_projects.map((projects) => (

                                        <TouchableOpacity onPress={() => handleAddProject(projects.id)} key={projects.id}>
                                            <View>
                                                <ThemedText type='defaultSemiBold'>{addingId === projects.id && <Feather name='check' />} {projects.name}</ThemedText>
                                            </View>
                                        </TouchableOpacity>

                                    ))
                                    }

                                </View>
                                <View style={{ padding: 15, flexDirection: 'column', gap: 10 }}>
                                    <ThemedText type='subtitle'>Membered Projects</ThemedText>
                                    {projects && projects.map((projects) => (

                                    <TouchableOpacity onPress={() => handleAddProject(projects.id)} key={projects.id}>
                                        <View>
                                            <ThemedText type='defaultSemiBold'>{addingId === projects.id && <Feather name='check' />} {projects.name}</ThemedText>
                                        </View>
                                    </TouchableOpacity>

                                    ))
                                    }

                                </View>
                            </ScrollView>

                        </ThemedView>

                        <ThemedView style={{ flexDirection: 'column', gap: 10, paddingBottom: Platform.OS === 'ios' ? 34 : 10, width: '100%', padding: 10 }}>

                            {projectMessage ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{projectMessage}</Text> : <Text style={{ fontSize: 10 }} />}

                            <TouchableOpacity onPressIn={() => addPost()} style={[styles.button, projectBlocked && styles.disabledButton]} disabled={projectBlocked}>
                                <ThemedText type="defaultSemiBold" style={[styles.buttonText, projectBlocked && styles.disabledText]}>{isProjectLoading ? <Feather name='loader' /> : 'Add to project'}</ThemedText>
                            </TouchableOpacity>

                        </ThemedView>
                    </KeyboardAvoidingView>
                </Modal>

                <View style={{ minHeight: 450, maxHeight: 550, width: '100%', borderRadius: 20, backgroundColor: Colors.general.missingMediaBackground }}>
                    <Image
                        source={{ uri: image }}
                        style={{width: '100%', height: '100%', borderRadius: 20}}

                    />

                    <View style={styles.backButtonContainer}>
                        <BackBlockButton />
                    </View>
                </View>

                <ThemedView style={{ flexDirection: 'row', paddingHorizontal: 8, gap: 10 }}>

                    <TouchableOpacity>
                        <Feather name='flag' size={28} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCommentsVisible(true)}>
                        <Feather name='message-circle' size={28} color={'white'} />
                    </TouchableOpacity>

                    {author_id === user.user?.id && self_projects.length + projects.length > 0 &&
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setProjectMenuVisible(true)}>
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <ThemedText type='defaultSemiBold'>Add to project</ThemedText>
                                <Feather name='calendar' size={28} color={'white'} />

                            </View>
                        </TouchableOpacity>
                    }

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
    buttonCube: {
        borderWidth: 1,
        padding: 15,
        height: 60,
        width: 60,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    button: {
        borderWidth: 1,
        padding: 15,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        height: 60
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