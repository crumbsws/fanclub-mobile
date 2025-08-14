import ProfileImageDisplay from './ProfileImageDisplay';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native'
import { ThemedText } from '../ThemedText';




interface PostViewDisplayProps {
    username: string,
    id: string,
    profile_image: string | null,
    created_at: string,
    image: string,
    context: string | null
}



export default function PostViewDisplay({ id, username, profile_image, created_at, image, context }: PostViewDisplayProps) {

    

    return (
        <View style={{ minHeight: 450, maxHeight: 550, width: '100%', flexDirection: 'column', gap: 20 }}>



            <Image
                source={{ uri: image }}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}

            />


            <View style={{ flexDirection: 'row' }}>
                <ProfileImageDisplay size={50} image={profile_image}></ProfileImageDisplay>
                <ThemedText style={styles.profileText} type="defaultSemiBold">{username}</ThemedText>
                {context ?
                (<ThemedText type='default' style={styles.profileText}>{context}</ThemedText>) : (<></>)
                }
            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({

    profileText: {
        marginTop: 5,
        marginLeft: 10,
    },

})