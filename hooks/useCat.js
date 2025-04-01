import { useState, useEffect } from 'react';
import CatStorageService from '../services/storage/./storageService';
import Cat from '../models/Cat';

export function useCat(catId) {
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCat() {
            try {
                setLoading(true);

                if (!catId) {
                    // Create a new cat if no ID is provided
                    const newCat = new Cat(
                        CatStorageService.generateId(),
                        'New Cat',
                        'Tabby',
                        'normal'
                    );
                    setCat(newCat);
                } else {
                    const loadedCat = await CatStorageService.loadCat(catId);
                    if (loadedCat) {
                        setCat(loadedCat);
                    } else {
                        setError('Could not find cat with that ID');
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadCat();
    }, [catId]);

    const updateCat = async (updatedCat) => {
        setCat({...updatedCat});  // Create a new object to ensure React detects the change
        await CatStorageService.saveCat(updatedCat);
    };

    const feedCat = (foodValue) => {
        if (!cat) return;
        const updatedCat = {...cat};
        updatedCat.feed(foodValue);
        setCat({...updatedCat});
        CatStorageService.saveCat(updatedCat);
    };

    const playCat = (activityValue) => {
        if (!cat) return;
        const updatedCat = {...cat};
        updatedCat.play(activityValue);
        setCat({...updatedCat});
        CatStorageService.saveCat(updatedCat);
    };

    const healCat = (amount) => {
        if (!cat) return;
        const updatedCat = {...cat};
        updatedCat.heal(amount);
        setCat({...updatedCat});
        CatStorageService.saveCat(updatedCat);
    };

    const changeDifficulty = (difficulty) => {
        if (!cat) return;
        cat.setDifficulty(difficulty);
        updateCat({...cat});
    };

    return {
        cat,
        loading,
        error,
        feedCat,
        playCat,
        healCat,
        changeDifficulty,
        updateCat
    };
}