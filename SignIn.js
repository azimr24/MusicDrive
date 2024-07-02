import { GoogleSignin, } from "@react-native-google-signin/google-signin"
import { useEffect } from "react";
import { signInWithGoogle } from "./googleAuth.js";
import { 
    SafeAreaView, 
    View, 
    Image, 
    StyleSheet, 
    StatusBar, 
    Pressable,
    Text } from "react-native";

const CLIENT_ID = "1038734147598-o8rsehouohndksfugbnk9pg3oc8npnv7.apps.googleusercontent.com"
const SCOPES = ['https://www.googleapis.com/auth/drive']
const logo = require('./icons/logo.png')

export const SignIn = ({navigation}) => {
    useEffect(() => {
        GoogleSignin.configure({
            scopes: SCOPES,
            iosClientId: CLIENT_ID,
            webClientId: CLIENT_ID,
            offlineAccess: true

        });

        const isSignedIn = () => {
            const signInStatus = GoogleSignin.hasPreviousSignIn();
            if (signInStatus) {
                navigation.navigate('Home');
            }
        }
        isSignedIn();
    }, [])

    const handleSignIn = () => {
        const user = signInWithGoogle()
        console.log(user);
        if (user) {
            navigation.navigate('Home')
        }
    }
    return (
        <SafeAreaView style={styles.background}>
            <StatusBar barStyle='light-content'></StatusBar>
            <View style={styles.container}>
                <Image style={styles.logo} source={logo}></Image>
                <Pressable style={styles.signInButton} onPress={handleSignIn}>
                    <Text style={styles.signInText}>Sign In</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
};




const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgb(0, 0, 0)',
        flex: 1
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        height: 120,
        width: 120,
        borderRadius: 10,
        marginBottom: 30
    },
    signInButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(30, 185, 96)',
        padding: 10,
        borderRadius: 5,
    },
    signInText: {
        fontWeight: "600",
        fontSize: 18,
        fontFamily: "Gill Sans"
    }
})


