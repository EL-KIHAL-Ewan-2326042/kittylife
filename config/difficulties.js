// src/config/difficulties.js

const DIFFICULTY_SETTINGS = {
    baby: {
        fullnessDecayMultiplier: 0.5,  // Diminution lente pour les bébés
        happinessDecayMultiplier: 0.5,
        healthDecayMultiplier: 0.5,
        feedingReward: 30,             // Grandes récompenses
        playingReward: 30,
        healingReward: 25
    },
    kitten: {
        fullnessDecayMultiplier: 1.0,  // Diminution standard
        happinessDecayMultiplier: 1.0,
        healthDecayMultiplier: 1.0,
        feedingReward: 25,
        playingReward: 20,
        healingReward: 15
    },
    lion: {
        fullnessDecayMultiplier: 1.5,  // Diminution rapide
        happinessDecayMultiplier: 1.5,
        healthDecayMultiplier: 1.5,
        feedingReward: 20,             // Petites récompenses
        playingReward: 15,
        healingReward: 10
    }
};

export const getDifficultySettings = (difficulty) => {
    return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.kitten;
};

export const getDifficulties = () => {
    return Object.keys(DIFFICULTY_SETTINGS);
};