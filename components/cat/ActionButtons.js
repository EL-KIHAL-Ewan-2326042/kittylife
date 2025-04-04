import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ActionButtons = ({ onFeed, onPlay, onHeal, disabled, catStats }) => {
    const navigation = useNavigation();
    const { fullness, happiness, health } = catStats || { fullness: 0, happiness: 0, health: 0 };

    const getColorForPercentage = (value) => {
        if (value < 30) return '#ff5252'; // Rouge si faible
        if (value < 60) return '#ff9800'; // Orange si moyen
        return '#4caf50'; // Vert si bon
    };

    const iconSize = 43; // Taille des icônes

    return (
        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={[styles.actionButton, disabled && styles.disabledButton, { backgroundColor: '#ffeda3' }]}
                onPress={() => navigation.navigate('CatSelection')}
                disabled={disabled}
            >
                <View style={styles.buttonContent}>
                    <Image
                        source={require('../../assets/icons/back.png')}
                        style={[styles.buttonIcon, { width: iconSize, height: iconSize }]}
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, disabled && styles.disabledButton]}
                onPress={onFeed}
                disabled={disabled}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.buttonGaugeContainer}>
                        <View
                            style={[
                                styles.buttonGauge,
                                {
                                    height: `${fullness}%`,
                                    backgroundColor: getColorForPercentage(fullness)
                                }
                            ]}
                        />
                    </View>
                    <Image
                        source={require('../../assets/icons/food.png')}
                        style={[styles.buttonIcon, { width: iconSize, height: iconSize }]}
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, disabled && styles.disabledButton]}
                onPress={onPlay}
                disabled={disabled}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.buttonGaugeContainer}>
                        <View
                            style={[
                                styles.buttonGauge,
                                {
                                    height: `${happiness}%`,
                                    backgroundColor: getColorForPercentage(happiness)
                                }
                            ]}
                        />
                    </View>
                    <Image
                        source={require('../../assets/icons/play.png')}
                        style={[styles.buttonIcon, { width: iconSize, height: iconSize }]}
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, disabled && styles.disabledButton]}
                onPress={onHeal}
                disabled={disabled}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.buttonGaugeContainer}>
                        <View
                            style={[
                                styles.buttonGauge,
                                {
                                    height: `${health}%`,
                                    backgroundColor: getColorForPercentage(health)
                                }
                            ]}
                        />
                    </View>
                    <Image
                        source={require('../../assets/icons/heal.png')}
                        style={[styles.buttonIcon, { width: iconSize, height: iconSize }]}
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    actionButton: {
        backgroundColor: '#b6b6b6',
        flex: 1,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 70,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'black',
    },
    buttonContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGaugeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    buttonGauge: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    buttonIcon: {
        zIndex: 2,
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default ActionButtons;