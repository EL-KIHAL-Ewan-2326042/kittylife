// src/screens/CreateCatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/ui/Background';
import { createNewCat } from '../services/storage/CatStorage';

export default function CreateCatScreen({ navigation }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [difficulty, setDifficulty] = useState('normal');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a name for your cat');
            return;
        }

        try {
            const newCat = await createNewCat(name, breed || 'Mixed', difficulty);
            navigation.navigate('Cat', {
                catId: newCat.id,
                catName: newCat.name
            });
        } catch (err) {
            console.error('Error creating cat:', err);
            setError('Failed to create cat: ' + err.message);
        }
    };

    const handleChangeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty);
    };

    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.title}>Create a New Cat</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter cat's name"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Breed:</Text>
                    <TextInput
                        style={styles.input}
                        value={breed}
                        onChangeText={setBreed}
                        placeholder="Enter cat's breed"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Difficulty:</Text>
                    <View style={styles.difficultyButtons}>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                difficulty === 'easy' && styles.activeDiffButton
                            ]}
                            onPress={() => handleChangeDifficulty('easy')}
                        >
                            <Text style={[
                                styles.diffButtonText,
                                difficulty === 'easy' && styles.activeDiffText
                            ]}>Easy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                difficulty === 'normal' && styles.activeDiffButton
                            ]}
                            onPress={() => handleChangeDifficulty('normal')}
                        >
                            <Text style={[
                                styles.diffButtonText,
                                difficulty === 'normal' && styles.activeDiffText
                            ]}>Normal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.diffButton,
                                difficulty === 'hard' && styles.activeDiffButton
                            ]}
                            onPress={() => handleChangeDifficulty('hard')}
                        >
                            <Text style={[
                                styles.diffButtonText,
                                difficulty === 'hard' && styles.activeDiffText
                            ]}>Hard</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreate}
                    >
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    // Styles as defined previously
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    formGroup: {
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    difficultyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    diffButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#e0e0e0',
        margin: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeDiffButton: {
        backgroundColor: '#4caf50',
    },
    diffButtonText: {
        fontWeight: 'bold',
    },
    activeDiffText: {
        color: 'white',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    createButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});