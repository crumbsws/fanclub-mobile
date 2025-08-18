import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import ProfileImageDisplay from './ProfileImageDisplay';
import { ThemedView } from '../ThemedView';
import { CDN_URL } from '@/constants/Endpoints';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';

interface CommentDisplayProps {
    comment_id: string;
    comments: Comment[];
    onReply: (commentId: string) => void;
    layer?: number;
}

interface Comment {
    id: string;
    content: string;
    created_at: string | null;
    author: Author;
    parent_id?: string | null;
}

interface Author {
    id: string;
    username: string;
    image: string | null;
}

export default function CommentViewDisplay({ comment_id, comments, onReply, layer = 0 }: CommentDisplayProps) {
    // Find the main comment
    const comment = comments.find(c => c.id === comment_id);


    // Find all child comments
    const childComments = comments.filter(c => c.parent_id === comment_id);

    if (!comment) return null;

    const indentStyle = {
        marginLeft: layer * 10,
        borderLeftWidth: layer > 0 ? 1 : 0,
        borderLeftColor: Colors.general.semiVisibleText,
        paddingLeft: layer > 0 ? 10 : 0,

    };

    return (
        <ThemedView style={indentStyle}>

            <View style={{ padding: 15, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <ProfileImageDisplay size={30} image={comment.author.image === null ? (null) : (CDN_URL + '/' + comment.author.image)} />
                    <Link href={`/profile/${comment.author.id}`} style={{ marginLeft: 10 }}>

                        <ThemedText type="defaultSemiBold">
                            {comment.author.username}
                        </ThemedText>
                    </Link>
                </View>
                <ThemedText style={{ marginBottom: 10 }}>
                    {comment.content}
                </ThemedText>
                <TouchableOpacity onPress={() => onReply(comment.id)}>
                    <ThemedText style={{ color: Colors.general.semiVisibleText, fontSize: 12 }}>Reply</ThemedText>
                </TouchableOpacity>
            </View>


            {childComments.map((childComment) => (
                <CommentViewDisplay
                    key={childComment.id}
                    comment_id={childComment.id}
                    comments={comments}
                    onReply={onReply}
                    layer={layer + 1}
                />
            ))}
        </ThemedView>
    );
}