
import { StyleSheet, Image } from "react-native";
import { Colors } from '@/constants/Colors';

    interface ProfileImageDisplayProps {
    size: number;
    image: string | null; 
    }

export default function ProfileImageDisplay({ size, image }: ProfileImageDisplayProps) {



const styles = sizedStyles(size);

    return (
      <Image
        source={image !== null ? { uri: image } : require('@/assets/images/no-profile-picture.png')}
        style={styles.profileImage}
      />
      
    )
}


const sizedStyles = (size: number) => StyleSheet.create({

  profileImage: {
    width: size,
    height: size,
    borderRadius: size / 2,
    objectFit: 'cover',
    backgroundColor: Colors.general.missingMediaBackground
  },
});