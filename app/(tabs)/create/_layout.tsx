
import { Stack } from 'expo-router';



export default function CreateLayout() {
  

  return (

      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="post" options={{ headerShown: false,  }}/>
        <Stack.Screen name="project" options={{ headerShown: false,  }}/>
      </Stack>

  );
}