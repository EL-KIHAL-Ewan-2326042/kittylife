// src/components/cat/StatusBars.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBars({ cat }) {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{cat.name} the {cat.breed}</Text>

            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Health:</Text>
                <View style={styles.barContainer}>
                    <View style={[styles.bar, styles.healthBar, { width: `${cat.health}%` }]} />
                </View>
                <Text style={styles.statValue}>{Math.round(cat.health)}%</Text>
            </View>

            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Hunger:</Text>
                <View style={styles.barContainer}>
                    <View style={[styles.bar, styles.hungerBar, { width: `${cat.fullness}%` }]} />
                </View>
                <Text style={styles.statValue}>{Math.round(cat.fullness)}%</Text>
            </View>

            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Happiness:</Text>
                <View style={styles.barContainer}>
                    <View style={[styles.bar, styles.happinessBar, { width: `${cat.happiness}%` }]} />
                </View>
                <Text style={styles.statValue}>{Math.round(cat.happiness)}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        margin: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    statLabel: {
        width: 80,
        fontSize: 16,
    },
    barContainer: {
        flex: 1,
        height: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
    },
    healthBar: {
        backgroundColor: '#4caf50',
    },
    hungerBar: {
        backgroundColor: '#ff9800',
    },
    happinessBar: {
        backgroundColor: '#2196f3',
    },
    statValue: {
        width: 50,
        textAlign: 'right',
        marginLeft: 5,
    },
});