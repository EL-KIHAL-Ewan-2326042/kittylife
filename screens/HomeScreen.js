// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';

export default function HomeScreen({ navigation, route }) {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reload cats when navigating back to this screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadCats();
        });

        return unsubscribe;
    }, [navigation]);

    // Initial load
    useEffect(() => {
        loadCats();
    }, []);

    const loadCats = async () => {
        setLoading(true);
        try {
            const catList = await StorageService.getAllCats();
            setCats(catList);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger vos chats');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCat = () => {
        if (cats.length >= 3) {
            Alert.alert(
                'Limite atteinte',
                'Vous ne pouvez pas avoir plus de 3 chats.',
                [{ text: 'OK' }]
            );
            return;
        }
        navigation.navigate('CreateCat');
    };

    const renderCatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.catItem}
            onPress={() => navigation.navigate('Cat', {
                catId: item.id,
                catName: item.name
            })}
        >
            <Text style={styles.catName}>{item.name}</Text>
            <Text style={styles.catBreed}>{item.breed}</Text>
        </TouchableOpacity>
    );

    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.title}>Mes chats virtuels</Text>

                {cats.length > 0 ? (
                    <FlatList
                        data={cats}
                        renderItem={renderCatItem}
                        keyExtractor={item => item.id}
                        style={styles.list}
                    />
                ) : (
                    <Text style={styles.emptyCatsMessage}>
                        {loading ? 'Chargement...' : 'Pas encore de chats. Créez votre premier chat!'}
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateCat}
                >
                    <Text style={styles.createButtonText}>Créer un nouveau chat</Text>
                </TouchableOpacity>
            </View>
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
    list: {
        flex: 1,
        marginBottom: 20,
    },
    catItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
    },
    catName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    catBreed: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    statText: {
        fontSize: 12,
    },
    emptyCatsMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 30,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        borderRadius: 10,
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