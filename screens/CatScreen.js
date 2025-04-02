import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Background from '../components/ui/Background';
import StatusBars from '../components/ui/StatusBars';
import CatSprite from '../components/cat/CatSprite';
import ActionButtons from '../components/cat/ActionButtons';
import { FoodList } from '../components/food/FoodList';
import { ActivityList } from '../components/activities/ActivityList';
import { HealingList } from '../components/healing/HealingList';
import StorageService from '../services/storage/storageService';
import {getDifficultySettings} from "../utils/FileUtils";

export default function CatScreen({ route, navigation }) {
    const { catId } = route.params;
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);
    const [showFoodList, setShowFoodList] = useState(false);
    const [showActivityList, setShowActivityList] = useState(false);
    const [showHealingList, setShowHealingList] = useState(false);
    const [updateInterval, setUpdateIntervalRef] = useState(null);
    const [catPosition, setCatPosition] = useState(null);
    const catContainerRef = useRef(null);


    React.useEffect(() => {
        loadCat();

        // On nettoie bien l'intervalle préexistant
        return () => {
            if (updateInterval) {
                clearInterval(updateInterval);
            }
        };
    }, [catId]);

// useEffect séparé pour la mise à jour des statistiques
    React.useEffect(() => {
        if (!cat) return;

        // Obtenir les paramètres de difficulté
        const settings = getDifficultySettings(cat.difficulty);
        const { BASE_RATES } = require('../config/difficulties');

        // Calculer les taux de décroissance standardisés
        const fullnessDecayRate = BASE_RATES.fullnessDecay * settings.fullnessDecayMultiplier;
        const happinessDecayRate = BASE_RATES.happinessDecay * settings.happinessDecayMultiplier;
        const healthDecayRate = BASE_RATES.healthDecay * settings.healthDecayMultiplier;

        // Créer un nouvel intervalle
        const intervalRef = setInterval(() => {
            setCat(currentCat => {
                if (!currentCat) return currentCat;

                // Mise à jour avec les taux standardisés
                const updatedCat = {...currentCat};
                updatedCat.fullness = Math.max(0, updatedCat.fullness - fullnessDecayRate);
                updatedCat.happiness = Math.max(0, updatedCat.happiness - happinessDecayRate);

                // Calculer la pénalité de santé
                const healthPenalty = (
                    (updatedCat.fullness < 30 ? 1.5 : 0) +
                    (updatedCat.happiness < 30 ? 1.5 : 0) +
                    1 // Diminution de base
                );

                updatedCat.health = Math.max(0, updatedCat.health - healthDecayRate * healthPenalty);

                // Sauvegarde périodique
                if (Math.random() < 0.1) {
                    StorageService.saveCat(updatedCat);
                }

                return updatedCat;
            });
        }, 1000);

        setUpdateIntervalRef(intervalRef);

        return () => {
            clearInterval(intervalRef);
        };
    }, [cat?.id]);

    const measureCatPosition = () => {
        if (catContainerRef.current) {
            catContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
                // Ajuster la zone de détection pour correspondre à la zone visible du chat
                const hitboxPadding = 30; // Réduire cette valeur pour un hitbox plus précis

                setCatPosition({
                    x: pageX + hitboxPadding,
                    y: pageY + hitboxPadding,
                    width: width - (2 * hitboxPadding),
                    height: height - (2 * hitboxPadding)
                });
            });
        }
    };

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
            setCat(loadedCat);

            if (loadedCat.health < 30) {
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


    const feedCat = async (food) => {
        if (!cat) return;

        // Nettoyer l'intervalle précédent
        if (updateInterval) {
            clearInterval(updateInterval);
            setUpdateIntervalRef(null);
        }

        try {
            // Animation de nourriture
            setAnimation('eating');

            const settings = getDifficultySettings(cat.difficulty);

            const updatedCat = {...cat};
            updatedCat.fullness = Math.min(100, updatedCat.fullness + food.value);

            if (food.type === 'premium') {
                const healBonus = settings.healingReward ? settings.healingReward / 5 : 10;
                updatedCat.health = Math.min(100, updatedCat.health + healBonus);
            } else if (food.type === 'treat') {
                const happinessBonus = settings.playingReward ? settings.playingReward / 2 : 15;
                updatedCat.happiness = Math.min(100, updatedCat.happiness + happinessBonus);
            }

            updatedCat.lastFed = Date.now();

            // Sauvegarder les changements
            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});

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

            setTimeout(() => {
                setAnimation(null);

                // Créer un nouvel intervalle qui utilise une fonction de mise à jour
                // pour toujours avoir accès à la dernière version de l'état
                const interval = setInterval(() => {
                    setCat(currentCat => {
                        if (!currentCat) return currentCat;

                        const settings = getDifficultySettings(currentCat.difficulty);

                        const fullnessDecayRate = (1/10) * settings.fullnessDecayMultiplier;
                        const happinessDecayRate = (1/15) * settings.happinessDecayMultiplier;
                        const healthDecayRate = (1/20) * settings.healthDecayMultiplier;

                        const updatedCat = {...currentCat};
                        updatedCat.fullness = Math.max(0, updatedCat.fullness - fullnessDecayRate);
                        updatedCat.happiness = Math.max(0, updatedCat.happiness - happinessDecayRate);

                        // Calculer la pénalité de santé
                        const healthPenalty = (
                            (updatedCat.fullness < 30 ? 1.5 : 0) +
                            (updatedCat.happiness < 30 ? 1.5 : 0) +
                            1 // Diminution de base
                        );

                        updatedCat.health = Math.max(0, updatedCat.health - healthDecayRate * healthPenalty);

                        return updatedCat;
                    });
                }, 1000);

                setUpdateIntervalRef(interval);
            }, 2000);

        } catch (error) {
            console.error('Erreur lors du nourrissage:', error);
            Alert.alert('Erreur', 'Impossible de nourrir le chat');
            setAnimation(null);
        }
    };

    const playCat = async (activity) => {
        if (!cat) return;

        try {
            // Animation de jeu
            setAnimation(activity.animation || 'playing');

            // Mise à jour des statistiques
            const updatedCat = {...cat};
            updatedCat.happiness = Math.min(100, (updatedCat.happiness || 0) + activity.value);
            // Le jeu fatigue légèrement le chat
            updatedCat.energy = Math.max(0, (updatedCat.energy || 100) - (activity.value * 0.5));
            updatedCat.lastPlayed = Date.now();

            // Sauvegarder les changements
            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});

            let message = `${cat.name} s'est bien amusé!`;
            switch (activity.id) {
                case 'laser':
                    message = `${cat.name} a adoré courir après le pointeur laser!`;
                    break;
                case 'toy':
                    message = `${cat.name} s'amuse comme un fou avec la souris en peluche!`;
                    break;
                case 'petting':
                    message = `${cat.name} ronronne pendant que vous le caressez!`;
                    break;
            }

            Alert.alert('Génial!', message);

            // Réinitialiser l'animation après 3 secondes
            setTimeout(() => {
                setAnimation(null);
            }, 3000);

        } catch (error) {
            console.error('Erreur lors du jeu:', error);
            Alert.alert('Erreur', 'Impossible de jouer avec le chat');
            setAnimation(null);
        }
    };

    const healCat = async (healing) => {
        if (!cat) return;

        try {
            // Animation de soin
            setAnimation(healing.animation || 'healing');

            // Mise à jour des statistiques
            const updatedCat = {...cat};
            updatedCat.health = Math.min(100, (updatedCat.health || 0) + healing.value);

            if (healing.id === 'petting') {
                updatedCat.happiness = Math.min(100, (updatedCat.happiness || 0) + 5);
            }

            updatedCat.lastHealed = Date.now();

            // Sauvegarder les changements
            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});

            let message = `${cat.name} se sent mieux!`;
            switch (healing.id) {
                case 'medicine':
                    message = `${cat.name} n'aime pas le goût du médicament, mais ça fonctionne!`;
                    break;
                case 'brushing':
                    message = `Le pelage de ${cat.name} est maintenant propre et brillant!`;
                    break;
                case 'petting':
                    message = `Les câlins font beaucoup de bien à ${cat.name}!`;
                    break;
            }

            Alert.alert('Soigné!', message);

            // Réinitialiser l'animation après 2 secondes
            setTimeout(() => {
                setAnimation(null);
            }, 2000);

        } catch (error) {
            console.error('Erreur lors du soin:', error);
            Alert.alert('Erreur', 'Impossible de soigner le chat');
            setAnimation(null);
        }
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

    const handleFeed = () => {
        setShowFoodList(true);
    };

    const handlePlay = () => {
        setShowActivityList(true);
    };

    const handleHeal = () => {
        setShowHealingList(true);
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

                <View
                    ref={catContainerRef}
                    onLayout={measureCatPosition}
                    style={styles.catContainer}>
                    <CatSprite
                        animation={animation}
                        mood={cat.health < 30 ? 'sick' : (cat.happiness > 70 ? 'happy' : 'content')}
                    />
                </View>


                <ActionButtons
                    onBack={() => navigation.goBack()}
                    onFeed={handleFeed}
                    onPlay={handlePlay}
                    onHeal={handleHeal}
                    disabled={animation !== null}
                    catStats={{
                        fullness: cat.fullness || 0,
                        happiness: cat.happiness || 0,
                        health: cat.health || 0
                    }}
                />

                <FoodList
                    visible={showFoodList}
                    onClose={() => setShowFoodList(false)}
                    onFoodSelect={(food) => {
                        setShowFoodList(false);
                        feedCat(food);
                    }}
                    catPosition={catPosition}
                />

                <ActivityList
                    visible={showActivityList}
                    onClose={() => setShowActivityList(false)}
                    onActivitySelect={(activity) => {
                        setShowActivityList(false);
                        playCat(activity);
                    }}
                />

                <HealingList
                    visible={showHealingList}
                    onClose={() => setShowHealingList(false)}
                    onHealingSelect={(healing) => {
                        setShowHealingList(false);
                        healCat(healing);
                    }}
                />
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20
    },
    catContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff5252',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 40,
        margin: 20,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});