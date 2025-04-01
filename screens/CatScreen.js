import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Image, PanResponder, Animated } from 'react-native';
import { getDifficultySettings } from '../config/difficulties';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';
import CatSprite from '../components/cat/CatSprite';
import StatusBars from '../components/cat/StatusBars';

// Liste des nourritures disponibles
const foodItems = [
    { id: 'basic', name: 'Croquettes', type: 'basic', image: require('../assets/food/food-kibble.png'), value: 15 },
    { id: 'premium', name: 'Premium', type: 'premium', image: require('../assets/food/food-premium.png'), value: 30 },
    { id: 'treat', name: 'Friandise', type: 'treat', image: require('../assets/food/food-treat.png'), value: 10 }
];

// Composant pour un élément de nourriture draggable
const DraggableFoodItem = ({ food, onDrop }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [dragging, setDragging] = useState(false);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            setDragging(true);
            pan.setOffset({
                x: pan.x._value,
                y: pan.y._value
            });
            pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ], { useNativeDriver: false }),
        onPanResponderRelease: (e, gesture) => {
            setDragging(false);
            // Vérifier si on est au-dessus de la zone du chat
            // La logique dépendra de votre mise en page
            // Pour l'exemple, disons que si y < 300, c'est sur le chat
            if (gesture.moveY < 300) {
                onDrop(food);
            }
            // Réinitialiser la position
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 5,
                useNativeDriver: false
            }).start();
        }
    });

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.foodItem,
                dragging && styles.dragging,
                { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
            ]}
        >
            <Image source={food.image} style={styles.foodImage} />
            <Text style={styles.foodName}>{food.name}</Text>
        </Animated.View>
    );
};

const FoodList = ({ visible, onClose, onFoodSelect }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
    >
        <View style={styles.modalOverlay}>
            <View style={styles.foodModal}>
                <Text style={styles.foodModalTitle}>Choisir une nourriture</Text>
                <Text style={styles.foodInstructions}>
                    Faites glisser un aliment sur votre chat
                </Text>

                <View style={styles.foodItemsContainer}>
                    {foodItems.map(food => (
                        <DraggableFoodItem
                            key={food.id}
                            food={food}
                            onDrop={onFoodSelect}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);


const ActionButtons = ({ onFeed, onPlay, onHeal, disabled }) => (
    <View style={styles.actionsContainer}>
        <TouchableOpacity
            style={[styles.actionButton, disabled && styles.disabledButton]}
            onPress={onFeed}
            disabled={disabled}
        >
            <Text style={styles.actionButtonText}>Nourrir</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.actionButton, disabled && styles.disabledButton]}
            onPress={onPlay}
            disabled={disabled}
        >
            <Text style={styles.actionButtonText}>Jouer</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.actionButton, disabled && styles.disabledButton]}
            onPress={onHeal}
            disabled={disabled}
        >
            <Text style={styles.actionButtonText}>Soigner</Text>
        </TouchableOpacity>
    </View>
);

export default function CatScreen({ route, navigation }) {
    const { catId } = route.params;
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [showFoodList, setShowFoodList] = useState(false);
    const [catZoneLayout, setCatZoneLayout] = useState(null);

    useEffect(() => {
        loadCat();

        // Mettre à jour le chat toutes les secondes pour voir les barres diminuer en temps réel
        const interval = setInterval(async () => {
            if (cat) {
                const updatedCat = cat.update();
                setCat({...updatedCat});
                // Sauvegarder moins fréquemment pour éviter trop d'écritures
                if (Math.random() < 0.1) { // ~10% des updates
                    await StorageService.saveCat(updatedCat);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [cat?.id]); // Dépendance sur cat.id pour recréer l'intervalle si le chat change

    // Dans CatScreen.js, modifiez le loadCat pour ajouter la fonction getStatus si nécessaire
    const loadCat = async () => {
        setLoading(true);
        try {
            const loadedCat = await StorageService.getCat(catId);
            if (!loadedCat) {
                Alert.alert('Erreur', 'Chat introuvable', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') }
                ]);
                return;
            }

            // Ajout des méthodes manquantes si nécessaire
            if (!loadedCat.getStatus) {
                loadedCat.getStatus = function() {
                    return {
                        energy: this.energy || 100,
                        hunger: this.hunger || 0,
                        happiness: this.happiness || 100,
                        health: this.health || 100,
                        fullness: this.fullness || 50
                    };
                };
            }

            setCat(loadedCat);

            // Si le chat est mort, afficher une alerte
            if (!loadedCat.isAlive()) {
                Alert.alert(
                    'Oh non!',
                    `${loadedCat.name} est malade et a besoin de soins urgents!`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
            Alert.alert('Erreur', 'Impossible de charger les données du chat');
        } finally {
            setLoading(false);
        }
    };

    const measureCatZone = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setCatZoneLayout({ x, y, width, height });
    };

    const handleFeed = () => {
        // Afficher la liste de nourriture au lieu de nourrir directement
        setShowFoodList(true);
    };


    const handlePlay = async () => {
        if (!cat) return;
        try {
            const updatedCat = cat.play();
            await StorageService.saveCat(updatedCat);
            await loadCat(); // Recharger les données du chat
            Alert.alert('Génial!', `${cat.name} s'est bien amusé!`);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de jouer avec le chat');
        }
    };

    const handleHeal = async () => {
        if (!cat) return;
        try {
            const updatedCat = cat.heal();
            await StorageService.saveCat(updatedCat);
            await loadCat(); // Recharger les données du chat
            Alert.alert('Soigné!', `${cat.name} se sent mieux!`);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de soigner le chat');
        }
    };

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
        feedCat(food);
        setShowFoodList(false);
    };

    const feedCat = async (food) => {
        if (!cat) return;

        try {
            // Créer une copie correcte du chat avec toutes les méthodes préservées
            let updatedCat;
            if (typeof cat.feed === 'function') {
                updatedCat = cat.feed(food.value, food);
            } else {
                // Si le chat n'a pas de méthode feed, préserver son identité
                updatedCat = {...cat};
                updatedCat.id = cat.id;  // S'assurer que l'ID est préservé
                updatedCat.energy = Math.min(100, (updatedCat.energy || 0) + food.value);
                updatedCat.hunger = Math.max(0, (updatedCat.hunger || 100) - (food.value * 1.5));
                updatedCat.fullness = Math.min(100, (updatedCat.fullness || 0) + food.value);

                if (food.type === 'premium') {
                    updatedCat.health = Math.min(100, (updatedCat.health || 0) + 5);
                } else if (food.type === 'treat') {
                    updatedCat.happiness = Math.min(100, (updatedCat.happiness || 0) + 10);
                }

                updatedCat.lastFed = Date.now();
                updatedCat.lastUpdated = Date.now();
            }

            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});

            // Message personnalisé selon le type de nourriture
            let message = `${cat.name} a été nourri!`;
            if (food) {
                switch (food.type) {
                    case 'premium':
                        message = `${cat.name} adore cette nourriture premium!`;
                        break;
                    case 'treat':
                        message = `${cat.name} est ravi de cette friandise!`;
                        break;
                }
            }

            Alert.alert('Miam!', message);
        } catch (error) {
            console.error('Erreur lors du nourrissage:', error);
            Alert.alert('Erreur', 'Impossible de nourrir le chat');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmation',
            `Êtes-vous sûr de vouloir abandonner ${cat.name}?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Oui',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await StorageService.deleteCat(catId);
                            navigation.navigate('Home');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer le chat');
                        }
                    }
                }
            ]
        );
    };

    if (loading || !cat) {
        return (
            <Background>
                <View style={styles.container}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            </Background>
        );
    }

    return (
        <Background>
            <View style={styles.container}>
                <StatusBars cat={cat} />

                <View onLayout={measureCatZone} style={styles.catContainer}>
                    <CatSprite
                        animation={animation}
                        mood={cat.getMood ? cat.getMood() : 'content'}
                    />
                </View>

                <ActionButtons
                    onFeed={handleFeed}
                    onPlay={handlePlay}
                    onHeal={handleHeal}
                    disabled={animation !== null}
                />

                <FoodList
                    visible={showFoodList}
                    onClose={() => setShowFoodList(false)}
                    onFoodSelect={handleFoodSelect}
                />

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Abandonner {cat.name}</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20
    },
    foodItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        margin: 5,
        width: 80,
        height: 100,
    },
    dragging: {
        backgroundColor: '#e0e0e0',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    foodImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    foodName: {
        fontSize: 12,
        textAlign: 'center',
    },
    foodInstructions: {
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    statusContainer: {
        padding: 15,
    },
    statusBar: {
        marginBottom: 10,
    },
    statusLabel: {
        color: 'white',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    barContainer: {
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
    },
    catContainer: {
        alignItems: 'center',
        margin: 20,
    },
    catImage: {
        width: 200,
        height: 200,
    },
    moodText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
    },
    actionButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
// Dans les styles de CatScreen.js, ajoutez :
    foodListContainer: {
        position: 'absolute',
        bottom: 120, // Position au-dessus des icônes d'action
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 999, // S'assurer qu'il est au-dessus des autres éléments
    },
    foodList: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        width: '90%',
        maxHeight: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    foodListTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    foodItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    closeButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#333',
        fontWeight: '500',
    },
});