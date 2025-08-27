
import PostGalleryDisplay from "@/components/ui/PostGalleryDisplay";
import { CDN_URL } from "@/constants/Endpoints";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";




interface MediaAttachment {
    id: string;
    s3_key: string;
    file_type: string;
}

interface Author {
    id: string;
    username: string;
    image: string | null;
}

interface PostGalleryContainerProps {
    posts: Post[];
    showProfileImage?: boolean;
}




interface Post {
    id: string;
    context: string | null;
    author_id: number;
    attachments: MediaAttachment[];
    created_at: string | null;
    author: Author;
}

interface ImageAuthorPair {
    author: Author,
    s3_key: string,
    id: string
}


export default function PostGalleryContainer({ posts, showProfileImage }: PostGalleryContainerProps) {
    const [leftColumn, setLeftColumn] = useState<ImageAuthorPair[]>([]);
    const [rightColumn, setRightColumn] = useState<ImageAuthorPair[]>([]);

    useEffect(() => {



        const left: ImageAuthorPair[] = [];
        const right: ImageAuthorPair[] = [];

        const imagePairs: ImageAuthorPair[] = [];


        posts?.forEach(post => {
            post?.attachments?.forEach(attachment => {
                if (attachment.file_type?.includes('image')) {
                    imagePairs.push({ author: post.author, s3_key: attachment.s3_key, id: post.id });
                }
            });
        })

        imagePairs.forEach((imageData: ImageAuthorPair, index: number) => {
            if (index % 2 === 0) {
                left.push(imageData);
            } else {
                right.push(imageData);
            }
        })


        setLeftColumn(left);
        setRightColumn(right);



    }, [posts]);

    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 60 }}>
            <View style={styles.column}>
                {leftColumn.map((imageData, index) => (

                    <PostGalleryDisplay key={index} id={imageData.id} image={CDN_URL + '/' + imageData.s3_key} profile_image={imageData.author.image === null ? (null) : (CDN_URL + '/' + imageData.author.image)} showProfileImage={false} />

                ))}
            </View>
            <View style={styles.column}>
                {rightColumn.map((imageData, index) => (

                    <PostGalleryDisplay key={index} id={imageData.id} image={CDN_URL + '/' + imageData.s3_key} profile_image={imageData.author.image === null ? (null) : (CDN_URL + '/' + imageData.author.image)} showProfileImage={false} />

                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 5,
        gap: 20
    }
});
