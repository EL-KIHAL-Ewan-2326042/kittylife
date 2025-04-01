// src/components/food/FoodList.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FoodItem from './FoodItem';
import { foodItems } from '../../constants/FoodData';

export default function FoodList({ onFoodSelect }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Food Items</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {foodItems.map(food => (
                    <FoodItem
                        key={food.id}
                        food={food}
                        onDragStart={onFoodSelect}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    }
});