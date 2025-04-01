// src/components/food/FoodItem.js
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function FoodItem({ food, onDragStart }) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onDragStart(food)}
        >
            <Image
                source={food.image}
                style={styles.image}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
});