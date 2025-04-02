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
