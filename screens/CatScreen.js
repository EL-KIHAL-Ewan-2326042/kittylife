import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';
import Background from '../components/ui/Background';
import CatSprite from '../components/cat/CatSprite';
import ActionButtons from '../components/cat/ActionButtons';
import { FoodList } from '../components/food/FoodList';
import { ActivityList } from '../components/activities/ActivityList';
import { HealingList } from '../components/healing/HealingList';
import StorageService from '../services/storage/storageService';
import { getDifficultySettings } from "../utils/FileUtils";

export default function CatScreen({ route, navigation }) {
    const { catId } = route.params;
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);
    const [visibleList, setVisibleList] = useState(null); // "food" | "activity" | "healing"
    const catContainerRef = useRef(null);

    useEffect(() => {
        loadCat();
        return () => clearInterval(updateStatsInterval.current);
    }, [catId]);

    useEffect(() => {
        const backAction = () => true;
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    const updateStatsInterval = useRef(null);

    useEffect(() => {
        if (!cat) return;

        const settings = getDifficultySettings(cat.difficulty);
        const { BASE_RATES } = require('../config/difficulties');

        updateStatsInterval.current = setInterval(() => {
            setCat(prevCat => {
                if (!prevCat) return prevCat;

                const updatedCat = { ...prevCat };
                updatedCat.fullness = Math.max(0, prevCat.fullness - BASE_RATES.fullnessDecay * settings.fullnessDecayMultiplier);
                updatedCat.happiness = Math.max(0, prevCat.happiness - BASE_RATES.happinessDecay * settings.happinessDecayMultiplier);

                const healthPenalty = (prevCat.fullness < 30 ? 1.5 : 0) + (prevCat.happiness < 30 ? 1.5 : 0) + 1;
                updatedCat.health = Math.max(0, prevCat.health - BASE_RATES.healthDecay * settings.healthDecayMultiplier * healthPenalty);

                if (Math.random() < 0.1) StorageService.saveCat(updatedCat);
                return updatedCat;
            });
        }, 1000);

        return () => clearInterval(updateStatsInterval.current);
    }, [cat?.id]);

    const loadCat = async () => {
        setLoading(true);
        try {
            const loadedCat = await StorageService.getCat(catId);
            if (!loadedCat) {
                Alert.alert('Erreur', 'Chat introuvable', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
                return;
            }
            setCat(loadedCat);
            if (loadedCat.health < 30) Alert.alert('Oh non!', `${loadedCat.name} est malade et a besoin de soins urgents!`);
        } catch {
            Alert.alert('Erreur', 'Impossible de charger les données du chat');
        } finally {
            setLoading(false);
        }
    };

    const updateCatStat = async (updates, actionMessage) => {
        if (!cat) return;
        setAnimation(updates.animation || null);

        const updatedCat = { ...cat, ...updates };
        await StorageService.saveCat(updatedCat);
        setCat(updatedCat);

        if (actionMessage) Alert.alert('Miam!', actionMessage);

        setTimeout(() => setAnimation(null), 2000);
    };

    const handleFeed = (food) => {
        const settings = getDifficultySettings(cat.difficulty);
        const updates = {
            fullness: Math.min(100, cat.fullness + food.value),
            health: food.type === 'premium' ? Math.min(100, cat.health + (settings.healingReward / 5 || 10)) : cat.health,
            happiness: food.type === 'treat' ? Math.min(100, cat.happiness + (settings.playingReward / 2 || 15)) : cat.happiness,
            lastFed: Date.now(),
            animation: 'eating'
        };
        updateCatStat(updates, `${cat.name} a été nourri!`);
    };

    const handlePlay = (activity) => {
        const updates = {
            happiness: Math.min(100, cat.happiness + activity.value),
            energy: Math.max(0, (cat.energy || 100) - activity.value * 0.5),
            lastPlayed: Date.now(),
            animation: activity.animation || 'playing'
        };
        updateCatStat(updates, `${cat.name} s'est bien amusé!`);
    };

    const handleHeal = (healing) => {
        const updates = {
            health: Math.min(100, cat.health + healing.value),
            happiness: healing.id === 'petting' ? Math.min(100, cat.happiness + 5) : cat.happiness,
            lastHealed: Date.now(),
            animation: healing.animation || 'healing'
        };
        updateCatStat(updates, `${cat.name} se sent mieux!`);
    };

    const deleteCat = () => {
        Alert.alert(
            'Confirmation',
            `Êtes-vous sûr de vouloir abandonner ${cat.name}?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Oui',
                    style: 'destructive',
                    onPress: async () => {
                        await StorageService.deleteCat(catId);
                        navigation.navigate('Home');
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
                <TouchableOpacity style={styles.deleteButton} onPress={deleteCat}>
                    <Text style={styles.deleteButtonText}>Abandonner {cat.name}</Text>
                </TouchableOpacity>

                <View ref={catContainerRef} style={styles.catContainer}>
                    <CatSprite animation={animation} mood={cat.health < 30 ? 'sick' : (cat.happiness > 70 ? 'happy' : 'content')} />
                </View>

                <ActionButtons
                    onBack={() => navigation.goBack()}
                    onFeed={() => setVisibleList('food')}
                    onPlay={() => setVisibleList('activity')}
                    onHeal={() => setVisibleList('healing')}
                    disabled={animation !== null}
                    catStats={{ fullness: cat.fullness, happiness: cat.happiness, health: cat.health }}
                />

                {visibleList === 'food' && <FoodList visible onClose={() => setVisibleList(null)} onFoodSelect={handleFeed} />}
                {visibleList === 'activity' && <ActivityList visible onClose={() => setVisibleList(null)} onActivitySelect={handlePlay} />}
                {visibleList === 'healing' && <HealingList visible onClose={() => setVisibleList(null)} onHealingSelect={handleHeal} />}
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingText: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 20 },
    catContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    deleteButton: { backgroundColor: '#ff5252', padding: 10, borderRadius: 8, alignItems: 'center', margin: 20 },
    deleteButtonText: { color: 'white', fontWeight: 'bold' }
});
