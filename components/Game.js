import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import CatManager from '../gameLogic/CatManager';

export default function Game() {
    const [catManager, setCatManager] = useState(null);
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initCat = async () => {
            const manager = new CatManager('pelo');
            const success = await manager.loadCat();

            if (!success) {
                await manager.createNewCat();
            }

            setCatManager(manager);
            setCat(manager.cat);
            setLoading(false);
        };

        initCat();
    }, []);

    const updateCatState = () => {
        setCat({...catManager.cat});
    };

    const handleFeed = () => {
        catManager.feedCat();
        updateCatState();
    };

    const handlePlay = () => {
        catManager.playCat();
        updateCatState();
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View>
            <Text>Name: {cat.name}</Text>
            <Text>Health: {cat.health}</Text>
            <Text>Fullness: {cat.fullness}</Text>
            <Text>Happiness: {cat.happiness}</Text>

            <Button title="Feed" onPress={handleFeed} />
            <Button title="Play" onPress={handlePlay} />
        </View>
    );
}