import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Image, PanResponder, Animated } from 'react-native';
import { getDifficultySettings } from '../config/difficulties';
import Background from '../components/ui/Background';
import StorageService from '../services/storage/storageService';
import CatSprite from '../components/cat/CatSprite';
import StatusBars from '../components/cat/StatusBars';

// Liste des nourritures disponibles
const foodItems = [
    { id: 'basic', name: 'Croquettes', type: 'basic', image: require('../assets/food/kibble.png'), value: 15 },
    { id: 'premium', name: 'Premium', type: 'premium', image: require('../assets/food/premium.png'), value: 30 },
    { id: 'treat', name: 'Friandise', type: 'treat', image: require('../assets/food/treat.png'), value: 10 }
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

const FoodList = ({ visible, onClose, onFoodSelect, foodItems }) => {
    if (!visible) return null;

    return (
        <View style={styles.foodListContainer}>
            <View style={styles.foodList}>
                <Text style={styles.foodListTitle}>Choisir une nourriture</Text>
                <View style={styles.foodItemsContainer}>
                    {foodItems.map(food => (
                        <FoodItem
                            key={food.id}
                            food={food}
                            onDragStart={() => onFoodSelect(food)}
                        />
                    ))}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};