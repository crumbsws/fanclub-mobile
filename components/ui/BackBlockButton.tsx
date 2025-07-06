import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from "react-native";


export default function BackBlockButton() {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()} style={{backgroundColor: '#fff', width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 18}}>
            <FontAwesome name={'arrow-left'} />
        </TouchableOpacity>
    )
}