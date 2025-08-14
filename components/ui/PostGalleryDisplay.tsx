import ProfileImageDisplay from './ProfileImageDisplay';
import { View, StyleSheet, Text, Image } from 'react-native'
import { ThemedText } from '../ThemedText';




interface PostViewDisplayProps {
    profile_image: string | null,
    image: string,
    showProfileImage: boolean
}



export default function PostGalleryDisplay({ image, profile_image, showProfileImage }: PostViewDisplayProps) {

    return (
        <View style={{
            width: '100%',
            height: 400,           
            borderRadius: 20,
            overflow: 'hidden',    
            backgroundColor: '#464655' 
        }}>
            <Image
                source={{ uri: image }}
                style={{
                    width: '100%',
                    height: '100%',      
                    resizeMode: 'cover'
                }}
            />

            {showProfileImage ? (
                <View style={{ position: 'absolute', bottom: 7, left: 7, shadowColor: '#000', shadowOffset: { width: -4, height: 0, }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 4 }}>
                    <ProfileImageDisplay size={50} image={profile_image} />
                </View>
            ) : (<></>)
            }



        </ View>
    )
}


