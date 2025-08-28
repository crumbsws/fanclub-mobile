import { Colors } from '@/constants/Colors';
import { CDN_URL } from '@/constants/Endpoints';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import ProfileImageDisplay from './ProfileImageDisplay';
import { Comment } from '@/types/types';

interface CommentDisplayProps {
    comment_id: string;
    comments: Comment[];
    onReply: (commentId: string) => void;
    layer?: number;
}


export default function CommentViewDisplay({ comment_id, comments, onReply, layer = 0 }: CommentDisplayProps) {
    // Find the main comment
    const comment = comments.find(c => c.id === comment_id);
    const childComments = comments.filter(c => c.parent_id === comment_id);

    const [isChildVisible, setIsChildVisible] = useState(false);

    // Find all child comments


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
                <View style={{ flexDirection: 'row', gap: 8}}>
                    <TouchableOpacity onPress={() => onReply(comment.id)}>
                        <ThemedText style={{ color: Colors.general.semiVisibleText, fontSize: 12 }}>Reply</ThemedText>
                    </TouchableOpacity>
                    {childComments.length != 0 &&
                    <TouchableOpacity onPress={() => setIsChildVisible(!isChildVisible)}>
                        <ThemedText style={{ color: Colors.general.semiVisibleText, fontSize: 12 }}>{!isChildVisible ? `View (${childComments.length})` : 'Hide'}</ThemedText>
                    </TouchableOpacity>
                    }
                </View>
            </View>


            {isChildVisible && childComments.map((childComment) => (
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