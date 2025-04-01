import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ActionButtons({ onFeed, onPlay, onHeal, disabled }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.feedButton, disabled && styles.disabled]}
                onPress={onFeed}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.playButton, disabled && styles.disabled]}
                onPress={onPlay}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.healButton, disabled && styles.disabled]}
                onPress={onHeal}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>Heal</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        minWidth: 100,
        alignItems: 'center',
        elevation: 3,
        marginHorizontal: 5,
    },
    feedButton: {
        backgroundColor: '#ff9800',
    },
    playButton: {
        backgroundColor: '#2196f3',
    },
    healButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
});