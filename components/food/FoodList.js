import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Animated, PanResponder } from 'react-native';

// Liste des nourritures disponibles
const foodItems = [
    { id: 'basic', name: 'Croquettes', type: 'basic', image: require('../../assets/food/food-kibble.png'), value: 15 },
    { id: 'premium', name: 'Premium', type: 'premium', image: require('../../assets/food/food-premium.png'), value: 30 },
    { id: 'treat', name: 'Friandise', type: 'treat', image: require('../../assets/food/food-treat.png'), value: 10 }
];

const DraggableFoodItem = ({ food, onDrop, catPosition, angle }) => {
    const pan = React.useRef(new Animated.ValueXY()).current;
    const [dragging, setDragging] = React.useState(false);
    const [visible, setVisible] = React.useState(true);

    // Calculer la position initiale sur le demi-cercle
    const radius = 110;
    const radians = angle * (Math.PI / 180);
    const x = -Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            setDragging(true);
            pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (evt, gestureState) => {
            if (catPosition) {
                const touchX = evt.nativeEvent.pageX;
                const touchY = evt.nativeEvent.pageY;

                const isOverCat =
                    touchX >= catPosition.x &&
                    touchX <= catPosition.x + catPosition.width &&
                    touchY >= catPosition.y &&
                    touchY <= catPosition.y + catPosition.height;

                if (isOverCat) {
                    setVisible(false);
                    onDrop(food);
                    pan.flattenOffset();
                    return;
                }
            }


            setDragging(false);
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                tension: 40,
                friction: 5,
                useNativeDriver: false
            }).start(() => {
                pan.flattenOffset();
            });
        }
    });

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.foodItem,
                {
                    position: 'absolute',
                    transform: [
                        { translateX: dragging ? Animated.add(pan.x, new Animated.Value(x)) : x },
                        { translateY: dragging ? Animated.add(pan.y, new Animated.Value(y)) : y }
                    ],
                    zIndex: dragging ? 1000 : 10
                },
                dragging && styles.dragging,
            ]}
        >
            <Image source={food.image} style={styles.foodImage} />
            <Text style={styles.foodName}>{food.name}</Text>
        </Animated.View>
    );
};

const FoodList = ({ visible, onClose, onFoodSelect, catPosition }) => {
    const wheelAnimation = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(wheelAnimation, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(wheelAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.transparentArea}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View style={[
                    styles.wheelContainer,
                    {
                        transform: [
                            { translateX: wheelAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0]
                                }) }
                        ],
                        opacity: wheelAnimation
                    }
                ]}>
                    <View style={styles.halfWheel}>
                        {foodItems.map((food, index) => {
                            // Répartir les éléments sur 180 degrés
                            const angle = -60 + (index * 60);
                            return (
                                <DraggableFoodItem
                                    key={food.id}
                                    food={food}
                                    onDrop={onFoodSelect}
                                    catPosition={catPosition}
                                    angle={angle}
                                />
                            );
                        })}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
    },
    transparentArea: {
        flex: 1,
    },
    wheelContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 160, // Augmenté pour laisser plus d'espace
        justifyContent: 'center',
    },
    halfWheel: {
        width: 240, // Augmenté de 200 à 240
        height: 240, // Augmenté de 200 à 240
        position: 'relative',
        right: -50, // Ajusté pour maintenir le demi-cercle (moitié de la largeur)
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        border: 'none',
        backgroundColor: '#61bb46',
        borderTopLeftRadius: 120, // Ajusté pour correspondre à la moitié de la largeur
        borderBottomLeftRadius: 120, // Ajusté pour correspondre à la moitié de la largeur
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        elevation: 1,
    },

    foodItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    dragging: {
        backgroundColor: '#e0e0e0',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },

    foodImage: {
        objectFit: "contain",
        width: "100%",
        height: "100%",
        marginBottom: 4,
    },
    foodName: {
        fontSize: 9,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export { foodItems, FoodList };