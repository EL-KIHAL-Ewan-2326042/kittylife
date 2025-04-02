import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function Background({ children }) {
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
    }
});