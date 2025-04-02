// src/components/ui/DifficultySelector.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DifficultySelector({ cat, onChangeDifficulty }) {
    const difficulties = ['easy', 'normal', 'hard'];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Difficulty:</Text>
            <View style={styles.buttonContainer}>
                {difficulties.map(difficulty => (
                    <TouchableOpacity
                        key={difficulty}
                        style={[
                            styles.button,
                            cat.difficulty === difficulty && styles.activeButton
                        ]}
                        onPress={() => onChangeDifficulty(difficulty)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                cat.difficulty === difficulty && styles.activeButtonText
                            ]}
                        >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        minWidth: 80,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        fontWeight: 'bold',
    },
    activeButtonText: {
        color: 'white',
    },
});