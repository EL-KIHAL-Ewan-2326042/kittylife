import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';
import CustomText from '../components/ui/CustomText';


export default function CatSelectionScreen({ navigation }) {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

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

        loadCats();

    }, []);


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
            <CustomText style={styles.catName}>{item.name}</CustomText>
            <CustomText style={styles.catBreed}>{item.breed}</CustomText>
        </TouchableOpacity>
    );

    return (
        <Background>
            <View style={styles.container}>
                <View style={styles.pancarte}>
                    <CustomText style={styles.title}>Mes Chats</CustomText>

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
                            <CustomText style={styles.emptyCatsMessage}>
                                {loading ? 'Chargement...' : 'Pas encore de chats. Créez votre premier chat!'}
                            </CustomText>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreateCat}
                    >
                        <CustomText style={styles.createButtonText}>Créer un nouveau chat</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <CustomText style={styles.createButtonText}>Revenir à l'écran titre</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pancarte: {
        backgroundColor: '#d2a679',
        borderWidth: 4,
        borderColor: '#7a4b27',
        padding: 20,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        width: '90%',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'pixelatedelegance',
        textAlign: 'center',
        color: '#4b2c20',
        marginBottom: 15,
        textShadowColor: '#7a4b27',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    list: {
        width: '100%',
    },
    listContent: {
        paddingBottom: 10,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },
    emptyCatsMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#3a1d0e',
        backgroundColor: '#e0c097',
        padding: 12,
        borderWidth: 3,
        borderColor: '#7a4b27',
        width: '100%',
    },
    catItem: {
        backgroundColor: '#7a4b27',
        padding: 15,
        borderWidth: 3,
        borderColor: '#4b2c20',
        marginVertical: 8,
        width: '100%',
    },
    catName: {
        fontSize: 18,
        color: '#fff8dc',
    },
    catBreed: {
        fontSize: 14,
        color: '#e0c097',
        marginTop: 5,
    },
    createButton: {
        backgroundColor: '#61bc44',
        borderColor: '#4a3533',
        borderWidth: 3,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginTop: 15,
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
        fontSize: 18,
        color: 'white',
    },
});

