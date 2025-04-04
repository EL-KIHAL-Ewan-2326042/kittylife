import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import StorageService from '../services/storage/storageService';

export default function useCat(catId, navigation) {
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);

    // Charge le chat depuis le stockage
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
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
            Alert.alert('Erreur', 'Impossible de charger les données du chat');
        } finally {
            setLoading(false);
        }
    };

    // Fonction générique pour mettre à jour le chat
    const updateCat = async (updateFunction, successMessage) => {
        if (!cat) return;
        try {
            const updatedCat = updateFunction({ ...cat });

            await StorageService.saveCat(updatedCat);
            setCat(updatedCat);

            if (successMessage) {
                Alert.alert('Succès', successMessage.replace('{name}', cat.name));
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du chat:', error);
            Alert.alert('Erreur', 'Impossible de mettre à jour le chat');
        }
    };

    // Actions sur le chat
    const feedCat = async (food) => {
        if (!cat) return;

        clearInterval(updateInterval);

        try {
            setAnimation('eating');

            setCat((prevCat) => {
                if (!prevCat) return prevCat;

                const settings = getDifficultySettings(prevCat.difficulty);

                const updatedCat = { ...prevCat };
                updatedCat.fullness = Math.min(100, prevCat.fullness + food.value);

                if (food.type === 'premium') {
                    const healBonus = settings.healingReward ? settings.healingReward / 5 : 10;
                    updatedCat.health = Math.min(100, prevCat.health + healBonus);
                } else if (food.type === 'treat') {
                    const happinessBonus = settings.playingReward ? settings.playingReward / 2 : 15;
                    updatedCat.happiness = Math.min(100, prevCat.happiness + happinessBonus);
                }

                updatedCat.lastFed = Date.now();

                return updatedCat;
            });

            await StorageService.saveCat(cat);

            Alert.alert('Miam!', `${cat.name} a mangé ${food.name} !`);

            setTimeout(() => {
                setAnimation(null);

                // Redémarrer le decay après avoir nourri
                const interval = setInterval(() => {
                    setCat((prevCat) => {
                        if (!prevCat) return prevCat;

                        const settings = getDifficultySettings(prevCat.difficulty);

                        const fullnessDecayRate = (1 / 10) * settings.fullnessDecayMultiplier;
                        const happinessDecayRate = (1 / 15) * settings.happinessDecayMultiplier;
                        const healthDecayRate = (1 / 20) * settings.healthDecayMultiplier;

                        const updatedCat = { ...prevCat };
                        updatedCat.fullness = Math.max(0, prevCat.fullness - fullnessDecayRate);
                        updatedCat.happiness = Math.max(0, prevCat.happiness - happinessDecayRate);

                        const healthPenalty =
                            (updatedCat.fullness < 30 ? 1.5 : 0) +
                            (updatedCat.happiness < 30 ? 1.5 : 0) +
                            1;

                        updatedCat.health = Math.max(0, prevCat.health - healthDecayRate * healthPenalty);

                        return updatedCat;
                    });
                }, 1000);

                setUpdateIntervalRef(interval);
            }, 2500); // Garde l'animation plus longtemps

        } catch (error) {
            console.error('Erreur lors du nourrissage:', error);
            Alert.alert('Erreur', 'Impossible de nourrir le chat');
            setAnimation(null);
        }
    };

    const playCat = () => updateCat((cat) => {
        cat.happiness = Math.min(100, cat.happiness + 10);
        return cat;
    }, "{name} s'est bien amusé!");

    const healCat = () => updateCat((cat) => {
        cat.health = Math.min(100, cat.health + 15);
        return cat;
    }, "{name} se sent mieux!");

    const deleteCat = async () => {
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
                            await StorageService.deleteCat(cat.id);
                            navigation.navigate('Home');
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (catId) {
            loadCat();
        }
    }, [catId]);

    return {
        cat,
        loading,
        animation,
        feedCat,
        playCat,
        healCat,
        deleteCat,
    };
}
