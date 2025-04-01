// src/screens/CreateCatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';
import { getDifficulties } from '../config/difficulties';

export default function CreateCatScreen({ navigation }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [difficulty, setDifficulty] = useState('normal');
    const [error, setError] = useState('');
    const difficulties = getDifficulties();

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Veuillez entrer un nom pour votre chat');
            return;
        }

        try {
            const newCat = await StorageService.createCat(
                name.trim(),
                breed.trim() || 'Mixed',
                difficulty
            );

            navigation.navigate('Cat', {
                catId: newCat.id,
                catName: newCat.name
            });
        } catch (err) {
            console.error('Erreur lors de la création du chat:', err);
            setError('Échec de la création : ' + err.message);
        }
    };

    const handleChangeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty);
    };

    return (
        <Background>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Créer un Nouveau Chat</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nom:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Entrez le nom du chat"
                        maxLength={20}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Race:</Text>
                    <TextInput
                        style={styles.input}
                        value={breed}
                        onChangeText={setBreed}
                        placeholder="Entrez la race du chat"
                        maxLength={30}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Difficulté:</Text>
                    <View style={styles.difficultyButtons}>
                        {difficulties.map(diff => (
                            <TouchableOpacity
                                key={diff}
                                style={[
                                    styles.diffButton,
                                    difficulty === diff && styles.activeDiffButton
                                ]}
                                onPress={() => handleChangeDifficulty(diff)}
                            >
                                <Text style={[
                                    styles.diffButtonText,
                                    difficulty === diff && styles.activeDiffButtonText
                                ]}>
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.difficultyInfo}>
                    <Text style={styles.difficultyInfoText}>
                        {difficulty === 'easy' && "Facile: Le chat perd faim et bonheur lentement."}
                        {difficulty === 'normal' && "Normal: Équilibre entre défi et plaisir."}
                        {difficulty === 'hard' && "Difficile: Le chat a besoin de beaucoup d'attention."}
                        {difficulty === 'baby' && "Bébé: Très faim, très heureux, mais fragile!"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreate}
                >
                    <Text style={styles.createButtonText}>Créer mon chat</Text>
                </TouchableOpacity>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginVertical: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    difficultyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    diffButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 5,
        minWidth: '23%',
        alignItems: 'center',
    },
    activeDiffButton: {
        backgroundColor: '#4caf50',
    },
    diffButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },
    activeDiffButtonText: {
        color: 'white',
    },
    difficultyInfo: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        borderRadius: 8,
        marginVertical: 15,
    },
    difficultyInfoText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});