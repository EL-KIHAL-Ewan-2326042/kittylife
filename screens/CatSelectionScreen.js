import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';

export default function CatSelectionScreen({ navigation }) {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCats = async () => {
            try {
                const allCats = await StorageService.getAllCats();
                setCats(allCats);
            } catch (error) {
                console.error("Erreur lors du chargement des chats:", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadCats);
        return unsubscribe;
    }, [navigation]);

    const handleCatPress = (catId) => {
        navigation.navigate('Cat', { catId });
    };

    const handleCreateCat = () => {
        navigation.navigate('CreateCat');
    };

    const renderCatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.catItem}
            onPress={() => handleCatPress(item.id)}
        >
            <Text style={styles.catName}>{item.name}</Text>
            <Text style={styles.catBreed}>{item.breed}</Text>
        </TouchableOpacity>
    );

    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.title}>Mes Chats</Text>

                {cats.length > 0 ? (
                    <FlatList
                        data={cats}
                        renderItem={renderCatItem}
                        keyExtractor={item => item.id}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyCatsMessage}>
                            {loading ? 'Chargement...' : 'Pas encore de chats. Créez votre premier chat!'}
                        </Text>
                    </View>
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
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 40,
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    list: {
        flex: 1,
        width: '100%',
    },
    listContent: {
        paddingBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        borderRadius: 8,
        width: '100%',
    },
    createButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});