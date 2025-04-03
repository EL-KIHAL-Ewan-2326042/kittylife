// components/cat/CatSprite.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';  // Importation de expo-image

export default function CatSprite({ animation, mood }) {
    // Choisir le bon sprite en fonction de l'humeur et de l'animation
    const getSprite = () => {
        switch(animation) {
            case 'eating':
                return require('../../assets/cat-eating.gif');
            case 'playing':
                return require('../../assets/cat-playing.gif');
            case 'playing_laser':
                return require('../../assets/cat-playing-laser.gif');
            case 'playing_toy':
                return require('../../assets/cat-playing-toy.gif');
            case 'playing_petting':
                return require('../../assets/cat-petting.gif');
            case 'healing':
                return require('../../assets/cat-healing.gif');
            case 'healing_medicine':
                return require('../../assets/cat-medicine.gif');
            case 'healing_brushing':
                return require('../../assets/cat-brushing.gif');
            case 'healing_petting':
                return require('../../assets/cat-petting.gif');
            default:
                // État normal basé sur l'humeur
                switch(mood) {
                    case 'happy':
                        return require('../../assets/cat-happy.gif');
                    case 'content':
                        return require('../../assets/cat-content.gif');
                    case 'sad':
                        return require('../../assets/cat-sad.gif');
                    case 'sick':
                        return require('../../assets/cat-sick.gif');
                    default:
                        return require('../../assets/cat-content.gif');
                }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={getSprite()}  // Utilisation de expo-image pour le rendu des images/GIFs
                style={styles.catImage}
                contentFit="contain"  // S'adapte à l'espace sans déformer
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 300,
    },
    catImage: {
        alignSelf: 'center',
        width: 180,
        height: 180,
    }
});
