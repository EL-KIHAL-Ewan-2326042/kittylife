import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text, BackHandler} from 'react-native';
import Background from '../components/ui/Background';

export default function HomeScreen({ navigation }) {

    /* Block back button */
    useEffect(() => {
        const backAction = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, []);

    const handleGoToCats = () => {
        navigation.navigate('CatSelection');
    };

    const handleCreateCat = () => {
        navigation.navigate('CreateCat');
    };

    return (
        <Background>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/kittylife-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoToCats}
                    >
                        <Text style={styles.buttonText}>C'est parti !</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 350,
        height: 200,
    },
    buttonsContainer: {
        width: '100%',
        marginTop: 30,
    },
    button: {
        backgroundColor: '#976360',
        borderColor: '#4a3533',
        borderWidth: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'rainyhearts',
        color: 'white',
        fontSize: 35,
        textShadowColor: 'white',
        textShadowOffset: { width: 0.5, height: 0 },
        textShadowRadius: 1,
    }
});