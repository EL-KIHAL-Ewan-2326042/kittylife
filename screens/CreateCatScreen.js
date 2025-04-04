import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, ScrollView, BackHandler} from 'react-native';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';
import { getDifficulties } from '../config/difficulties';
import CustomText from '../components/ui/CustomText';

export default function CreateCatScreen({ navigation }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [difficulty, setDifficulty] = useState('normal');
    const [error, setError] = useState('');
    const difficulties = getDifficulties();

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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.centerContainer}>
                    <View style={styles.creationcard}>
                        <CustomText style={styles.title}>Creer un chat</CustomText>

                        {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}

                        <View style={styles.formGroup}>
                            <CustomText style={styles.label}>Nom:</CustomText>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Entrez le nom du chat"
                                maxLength={20}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <CustomText style={styles.label}>Race:</CustomText>
                            <TextInput
                                style={styles.input}
                                value={breed}
                                onChangeText={setBreed}
                                placeholder="Entrez la race du chat"
                                maxLength={30}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <CustomText style={styles.label}>Difficulté:</CustomText>
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
                                        <CustomText style={[
                                            styles.diffButtonText,
                                            difficulty === diff && styles.activeDiffButtonText
                                        ]}>
                                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                        </CustomText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.difficultyInfo}>
                            <CustomText style={styles.difficultyInfoText}>
                                {difficulty === 'baby' && "Bébé: Très faim, très heureux, mais fragile!"}
                                {difficulty === 'kitten' && "Chaton: Le chat perd faim et bonheur lentement."}
                                {difficulty === 'lion' && "Lion: Un bébé lion qui a besoin de beaucoup d'attention."}
                            </CustomText>
                        </View>

                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreate}
                        >
                            <CustomText style={styles.createButtonText}>Créer mon chat</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.returnButton}
                            onPress={() => navigation.navigate('CatSelection')}
                        >
                            <CustomText style={styles.createButtonText}>Retour</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    centerContainer: {
        width: '90%',
        alignItems: 'center',
    },
    creationcard: {
        backgroundColor: '#d2a679',
        borderWidth: 4,
        borderColor: '#7a4b27',
        padding: 20,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'pixelatedelegance',
        textAlign: 'center',
        color: '#4b2c20',
        marginBottom: 20,
        marginTop: 10,
        textShadowColor: '#7a4b27',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    formGroup: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 20,
        marginBottom: 8,
        color: '#3a1d0e',
    },
    input: {
        backgroundColor: '#fff8dc',
        borderWidth: 3,
        borderColor: '#7a4b27',
        padding: 5,
        fontSize: 20,
        width: '100%',
        fontFamily: 'rainyhearts',
        textAlign: 'center',
    },
    difficultyButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    diffButton: {
        backgroundColor: '#f4b183',
        paddingVertical: 8,
        borderWidth: 3,
        borderColor: '#7a4b27',
        margin: 5,
        minWidth: 82,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDiffButton: {
        backgroundColor: '#c85a34',
    },
    diffButtonText: {
        fontSize: 18,
        color: '#3a1d0e',
    },
    activeDiffButtonText: {
        color: 'white',
    },
    difficultyInfo: {
        backgroundColor: '#e0c097',
        width: '100%',
        padding: 10,
        borderWidth: 3,
        borderColor: '#7a4b27',
        marginVertical: 10,
        textAlign: 'center',
    },
    difficultyInfoText: {
        fontSize: 16,
        color: '#3a1d0e',
        textAlign: 'center',
    },
    errorText: {
        color: '#ff0000',
        backgroundColor: '#3a1d0e',
        padding: 14,
        marginBottom: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#61bc44',
        borderColor: '#493230',
        borderWidth: 3,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    returnButton: {
        backgroundColor: '#976360',
        borderColor: '#493230',
        borderWidth: 3,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    createButtonText: {
        fontSize: 22,
        color: 'white',
    },
});
