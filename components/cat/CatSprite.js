// src/components/cat/CatSprite.js
import React, { useState } from 'react';
import { View, Image, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

export default function CatSprite({ animation, mood, onFeedWithFood }) {
    const [isEating, setIsEating] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Handle the drop event
    const handleFeedDrop = () => {
        if (onFeedWithFood) {
            setIsEating(true);
            setFeedback("+10");

            // Reset the state after animation completes
            setTimeout(() => {
                setIsEating(false);
                setFeedback(null);
            }, 1500);
        }
    };

    // Choose the right sprite based on mood and animation
    const getSprite = () => {
        if (isEating) {
            return require('../../assets/cat-eating.gif');
        }

        switch(animation) {
            case 'playing':
                return require('../../assets/cat-playing.gif');
            case 'healing':
                return require('../../assets/cat-healing.gif');
            default:
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
        <TouchableWithoutFeedback onPress={handleFeedDrop}>
            <View style={styles.container}>
                <Image
                    source={getSprite()}
                    style={styles.catImage}
                    resizeMode="contain"
                />
                {feedback && (
                    <Animated.Text style={styles.feedbackText}>
                        {feedback}
                    </Animated.Text>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    catImage: {
        width: 250,
        height: 250,
    },
    feedbackText: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4caf50',
        top: 80,
    }
});