// src/components/food/FoodItem.js
import React from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    View
} from 'react-native';

export default function FoodItem({ food, onDragStart }) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onDragStart(food)}
        >
            <Image source={food.image} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{food.name}</Text>
                <Text style={styles.value}>+{food.value} énergie</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        width: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 5
    },
    name: {
        fontWeight: 'bold',
        fontSize: 12
    },
    value: {
        fontSize: 10,
        color: 'green'
    }
});