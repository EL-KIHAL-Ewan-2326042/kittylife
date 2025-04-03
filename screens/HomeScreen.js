import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import Background from '../components/ui/Background';

export default function HomeScreen({ navigation }) {
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
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});