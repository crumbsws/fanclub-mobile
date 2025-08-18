import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/constants/Endpoints';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import { setUser } from '@/slices/userSlice';
import { Colors } from '@/constants/Colors';

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

    const dispatch = useAppDispatch();

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
                blocked = password.length < 8 || password.length > 20 || password.trim() !== confirmPassword.trim(); // More secure minimum
                break;
            default:
                blocked = false;
        }

        setMessage(''); // Clear message on step change
        setIsForwardBlocked(blocked);
    }, [boardingStep, username, email, password, confirmPassword]);


    async function Register() {
        if (isForwardBlocked) {
            setMessage('Please fill out all fields correctly.');
            return;
        }

        setIsForwardBlocked(true);
        setIsLoading(true);
        try {

            const response = await axios.post(`${API_URL}/auth/register`, {
                username: username,
                password: password,
                email: email
            });

            try {
                await SecureStore.setItemAsync('jwt_token', response.data.token);
            } catch (e) {
                setMessage('An error occurred while saving the token.');
                setIsForwardBlocked(false);
                setIsLoading(false);
                return;
            }

            dispatch(setUser(response.data.user))

            router.navigate('/(tabs)/feed/');

        } catch (error: any) {

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setMessage('Invalid request. Please check your input.');
                        break;
                    case 401:
                        setMessage('Username or email already exists.');
                        break;
                    case 403:
                        setMessage('Your account is not allowed to register.');
                        break;
                    case 500:
                        setMessage('Server error. Please try again later.');
                        break;
                    default:
                        setMessage('Registration failed. Please try again.');
                }
            }
            else if (error.request) {
                setMessage('No response received from server.');
            }


        }
        finally {
            setIsLoading(false);
            setIsForwardBlocked(false);
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

                            <View>
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
                                <ThemedText type="defaultSemiBold"><Feather name={'at-sign'} /> {username}</ThemedText>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => setBoardingStep(1)}>
                                <ThemedText type="defaultSemiBold"><Feather name={'mail'} /> {email}</ThemedText>
                            </TouchableOpacity>

                            {message ? <Text style={{ color: Colors.general.error, fontSize: 10 }}>{message}</Text> : <Text style={{ fontSize: 10 }} />}
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
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, isForwardBlocked && styles.disabledText]} >{boardingStep == maxPages ? isLoading ? <Feather name='loader' /> : 'Proceed' : 'Next'}</ThemedText>
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
