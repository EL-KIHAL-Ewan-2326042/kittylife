// src/screens/CatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCat } from '../hooks/useCat';
import Background from '../components/ui/Background';
import CatSprite from '../components/cat/CatSprite';
import StatusBars from '../components/cat/StatusBars';
import ActionButtons from '../components/ui/ActionButtons';
import FoodList from '../components/food/FoodList';
import { deleteCat } from '../services/storage/CatStorage';

export default function CatScreen({ route, navigation }) {
    const { catId } = route.params;
    const { cat, loading, error, feedCat, playCat, healCat } = useCat(catId);
    const [animation, setAnimation] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        if (cat) {
            navigation.setOptions({
                title: cat.name,
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={handleDeleteCat}
                    >
                        <Text style={{ color: 'red' }}>Delete</Text>
                    </TouchableOpacity>
                )
            });
        }
    }, [cat, navigation]);

    if (loading) return <Background><View style={styles.center}><Text>Loading...</Text></View></Background>;
    if (error) return <Background><View style={styles.center}><Text>Error: {error}</Text></View></Background>;
    if (!cat) return <Background><View style={styles.center}><Text>Cat not found</Text></View></Background>;

    const handleFeed = () => {
        if (selectedFood) {
            feedCat(selectedFood.value);
            setAnimation('eating');

            setTimeout(() => {
                setAnimation(null);
                setSelectedFood(null);
            }, 2000);
        } else {
            setSelectedFood({ value: 10, type: 'kibble' });
        }
    };

    const handlePlay = () => {
        playCat(15);
        setAnimation('playing');

        setTimeout(() => {
            setAnimation(null);
        }, 2000);
    };

    const handleHeal = () => {
        healCat(20);
        setAnimation('healing');

        setTimeout(() => {
            setAnimation(null);
        }, 2000);
    };

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
    };

    const handleDeleteCat = () => {
        Alert.alert(
            "Delete Cat",
            `Are you sure you want to delete ${cat.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteCat(cat.id);
                        navigation.navigate('Home');
                    }
                }
            ]
        );
    };

    return (
        <Background>
            <View style={styles.container}>
                <StatusBars cat={cat} />

                <CatSprite
                    animation={animation}
                    mood={cat.getMood ? cat.getMood() : 'content'}
                    onFeedWithFood={selectedFood ? handleFeed : null}
                />

                <ActionButtons
                    onFeed={handleFeed}
                    onPlay={handlePlay}
                    onHeal={handleHeal}
                    disabled={animation !== null}
                />

                <FoodList onFoodSelect={handleFoodSelect} />
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
});