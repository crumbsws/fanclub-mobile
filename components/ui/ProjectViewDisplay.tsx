
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import ProfileImageDisplay from "./ProfileImageDisplay";
import { Author, User } from "@/types/types";



interface ProjectViewDisplayProps {
    id: string;
    name: string;
    description: string | null;
    created_at: string; // isoformat() → string
    author_id: string;
    category: string;
    is_complete: boolean;
    username: string;
    profile_image: string | null;
    members: Author[];
}

export default function ProjectViewDisplay({ id, name, description, created_at, author_id, category, is_complete, username, profile_image, members }: ProjectViewDisplayProps) {


    const [visible, setVisible] = useState(false);

    return (
        <ThemedView style={{ width: '100%', flexDirection: 'column', gap: 15, alignItems: 'center' }}>

                <ThemedText type="title">{name}</ThemedText>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <ProfileImageDisplay size={25} image={profile_image}></ProfileImageDisplay>
                    <Link href={`/profile/${author_id}`}>
                        <ThemedText type="defaultSemiBold">{username}</ThemedText>
                    </Link>
                </View>
                <TouchableOpacity
                    style={[styles.buttonThin, styles.disabledButton]}
                    onPress={() => setVisible(true)}
                >
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.disabledText]}>
                        Edit
                    </ThemedText>
                </TouchableOpacity>
            

            {description !== null ? (
                <ThemedView style={{ width: '80%', borderBottomColor: Colors.general.semiVisibleText, borderWidth: 1, paddingBottom: 10 }}>
                    <ThemedText type='default' >{description}</ThemedText>
                </ThemedView>
            ) : (<></>)}


            <ThemedText type="default">{description}</ThemedText>
            <ThemedText type="default">{created_at}</ThemedText>
            <ThemedText type="default">{category}</ThemedText>
            <ThemedText type="default">{is_complete ? "Completed" : "In Progress"}</ThemedText>
            <ThemedText type="default">Members: {members.map(member => member.username).join(", ")}</ThemedText>
        </ThemedView>
    );



}

const styles = StyleSheet.create({
    buttonThin: {
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
        flex: 1,
        width: '100%'

    },
    editContentView: {

        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingTop: 80,
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

})