// hooks/useCat.js
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import StorageService from '../services/storage/storageService';

export default function useCat(catId, navigation) {
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);
    const updateInterval = useRef(null);


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

            if (!loadedCat.getStatus) {
                loadedCat.getStatus = function() {
                    return {
                        energy: this.energy || 100,
                        hunger: this.hunger || 0,
                        happiness: this.happiness || 100,
                        health: this.health || 100,
                        fullness: this.fullness || 50
                    };
                };
            }

            setCat(loadedCat);

            if (!loadedCat.isAlive()) {
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

    const setupUpdateInterval = () => {
        if (updateInterval.current) {
            clearInterval(updateInterval.current);
        }

        updateInterval.current = setInterval(async () => {
            if (cat) {
                const updatedCat = cat.update();
                setCat({...updatedCat});
                if (Math.random() < 0.1) {
                    await StorageService.saveCat(updatedCat);
                }
            }
        }, 1000);
    };

    const feedCat = async (food) => {
        if (!cat) return;

        try {
            if (updateInterval.current) {
                clearInterval(updateInterval.current);
            }

            let updatedCat;
            if (typeof cat.feed === 'function') {
                updatedCat = cat.feed(food.value, food);
            } else {
                updatedCat = {...cat};
                updatedCat.id = cat.id;
                updatedCat.energy = Math.min(100, (updatedCat.energy || 0) + food.value);
                updatedCat.hunger = Math.max(0, (updatedCat.hunger || 100) - (food.value * 1.5));
                updatedCat.fullness = Math.min(100, (updatedCat.fullness || 0) + food.value);

                if (food.type === 'premium') {
                    updatedCat.health = Math.min(100, (updatedCat.health || 0) + 5);
                } else if (food.type === 'treat') {
                    updatedCat.happiness = Math.min(100, (updatedCat.happiness || 0) + 10);
                }

                updatedCat.lastFed = Date.now();
                updatedCat.lastUpdated = Date.now();
            }

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
                setupUpdateInterval();
            }, 1000);
        } catch (error) {
            console.error('Erreur lors du nourrissage:', error);
            Alert.alert('Erreur', 'Impossible de nourrir le chat');
        }
    };

    const playCat = async () => {
        if (!cat) return;
        try {
            const updatedCat = cat.play();
            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});
            Alert.alert('Génial!', `${cat.name} s'est bien amusé!`);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de jouer avec le chat');
        }
    };

    const healCat = async () => {
        if (!cat) return;
        try {
            const updatedCat = cat.heal();
            await StorageService.saveCat(updatedCat);
            setCat({...updatedCat});
            Alert.alert('Soigné!', `${cat.name} se sent mieux!`);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de soigner le chat');
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

    useEffect(() => {
        loadCat();
        setupUpdateInterval();

        return () => {
            if (updateInterval.current) {
                clearInterval(updateInterval.current);
            }
        };
    }, [catId]);

    return {
        cat,
        loading,
        animation,
        setAnimation,
        feedCat,
        playCat,
        healCat,
        deleteCat
    };
}