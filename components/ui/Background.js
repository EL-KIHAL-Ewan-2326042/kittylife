import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Background({ children }) {
    const route = useRoute();
    const isCatScreen = route.name === 'Cat';

    if (isCatScreen) {
        return (
            <ImageBackground
                source={require('../../assets/pet-room-background.jpg')}
                style={styles.background}
                resizeMode="cover"
                imageStyle={styles.imageStyle}
            >
                {children}
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/kitty-ui-background.png')}
            style={styles.background}
            resizeMode="cover"
            imageStyle={styles.imageStyle}
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '130%',
        justifyContent: 'flex-start',
    },
    imageStyle: {
        top: -230,
        left: 0,
        alignSelf: 'flex-start',
    },
});
