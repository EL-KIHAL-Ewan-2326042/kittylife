
const DIFFICULTY_SETTINGS = {
    baby: {
        fullnessDecayMultiplier: 0.5,
        happinessDecayMultiplier: 0.5,
        healthDecayMultiplier: 0.5,
        feedingReward: 30,
        playingReward: 30,
        healingReward: 25
    },
    kitten: {
        fullnessDecayMultiplier: 1.0,
        happinessDecayMultiplier: 1.0,
        healthDecayMultiplier: 1.0,
        feedingReward: 25,
        playingReward: 20,
        healingReward: 15
    },
    lion: {
        fullnessDecayMultiplier: 1.5,
        happinessDecayMultiplier: 1.5,
        healthDecayMultiplier: 1.5,
        feedingReward: 20,
        playingReward: 15,
        healingReward: 10
    }
};

export const BASE_RATES = {
    fullnessDecay: 0.1,
    happinessDecay: 0.067,
    healthDecay: 0.05
};

export const getDifficultySettings = (difficulty) => {
    return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.kitten;
};

export const getDifficulties = () => {
    return Object.keys(DIFFICULTY_SETTINGS);
};