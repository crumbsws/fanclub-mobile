import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BoardingScreen() {

    const router = useRouter();
    const [boardingStep, setBoardingStep] = useState(0);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isForwardBlocked, setIsForwardBlocked] = useState(false);

    const maxPages = 3; // 0, 1, 2, 3

    useEffect(() => {
        let blocked = false;

        switch (boardingStep) {
            case 0:
                blocked = username.length < 3 || username.length > 20;
                break;
            case 1:
                // Better email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                blocked = !emailRegex.test(email);
                break;
            case 2:
                blocked = password.length < 8 || password.length > 20 || password!== confirmPassword; // More secure minimum
                break;
            default:
                blocked = false;
        }

        setMessage(''); // Clear message on step change
        setIsForwardBlocked(blocked);
    }, [boardingStep, username, email, password]);


    async function Register() {
        if (isForwardBlocked) {
            setMessage('Please fill out all fields correctly.');
            return;
        }
        setIsLoading(true);
        try {
            
            const response = await axios.post('http://192.168.1.115:5000/auth/register', {
              username: username,
              password: password,
              email: email
            });
      
            setIsLoading(false);
            router.push('/(tabs)/explore');
      
          } catch (error) {
      
            setIsLoading(false);
            setMessage('Registration failed.');
          }
    }

    const nextStep = () => {
        setBoardingStep(prevStep => prevStep + 1);
    };
    const previousStep = () => {
        if (boardingStep != 0) {
            setBoardingStep(prevStep => prevStep - 1)
        } else {
            router.back()
        }
    }

    function renderStep() {
        switch (boardingStep) {
            case 0:

                return (
                    <>

                        <ThemedText type="subtitle">What's your name?</ThemedText>

                        <View style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>

                            <TextInput
                                style={styles.boardingInput}
                                onChangeText={newUsername => setUsername(newUsername)}
                                defaultValue={username}
                                placeholder="captainkirk"
                                autoCapitalize="none"
                                autoComplete="username"
                                maxLength={20}


                            />
                        </View>
                    </>
                );
            case 1:

                return (
                    <>

                        <ThemedText type="subtitle">What's your mail?</ThemedText>

                        <View style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>

                            <TextInput
                                style={styles.boardingInput}
                                onChangeText={newEmail => setEmail(newEmail)}
                                defaultValue={email}
                                placeholder="kirk@enterprise.net"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"

                            />
                        </View>
                    </>
                );
            case 2:

                return (
                    <>

                        <ThemedText type="subtitle">Set your password</ThemedText>

                        <View style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>

                            <TextInput
                                style={styles.boardingInput}
                                onChangeText={newPassword => setPassword(newPassword)}
                                defaultValue={password}
                                secureTextEntry={true}
                                placeholder="Password"
                                maxLength={20}

                            />
                            <TextInput
                                style={styles.boardingInput}
                                onChangeText={newConfirmPassword => setConfirmPassword(newConfirmPassword)}
                                defaultValue={confirmPassword}
                                secureTextEntry={true}
                                placeholder="Re- Enter Password"
                                maxLength={20}

                            />
                        </View>
                    </>
                );

            case 3:

                return (
                    <>

                        <ThemedText type="subtitle">Ready to hop in!</ThemedText>

                        <View style={{ width: '70%', flexDirection: 'column', gap: 20, marginTop: 20 }}>


                            <TouchableOpacity onPress={() => setBoardingStep(0)}>
                                <ThemedText type="defaultSemiBold"><FontAwesome name={'hashtag'} /> {username}</ThemedText>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => setBoardingStep(1)}>
                                <ThemedText type="defaultSemiBold"><FontAwesome name={'envelope'} /> {email}</ThemedText>
                            </TouchableOpacity>

                            {message ? <Text style={{ color: 'red', fontSize: 10}}>{message}</Text> : <Text style={{fontSize: 10 }}/>}
                        </View>

                        

                        


                    </>
                );
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                {renderStep()}
            </View>




            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, paddingBottom: 20 }}>

                <TouchableOpacity onPress={previousStep} style={styles.button}>
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
                </TouchableOpacity>


                <TouchableOpacity onPress={boardingStep == maxPages ? Register : nextStep} style={[styles.button, isForwardBlocked && styles.disabledButton]} disabled={isForwardBlocked}>
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, isForwardBlocked && styles.disabledText]} >{boardingStep == maxPages ? isLoading ? <FontAwesome name='spinner' /> : 'Proceed' : 'Next'}</ThemedText>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 15,
        width: 120,
        backgroundColor: '#fff',
        borderRadius: 20
    },

    disabledButton: {
        backgroundColor: '#000',
        borderColor: '#fff'
    },

    disabledText: {
        color: '#fff'
    },

    boardingInput: {
        height: 60,
        borderWidth: 1,
        padding: 15,
        borderColor: '#fff',
        borderRadius: 10,
        color: '#fff'
    },

    buttonText: {
        color: '#000',
        fontSize: 14,
        textAlign: 'center'
    }
});
