import * as FileSystem from 'expo-file-system';

const DIFFICULTY_DIRECTORY = FileSystem.documentDirectory + 'data/difficulties/';
const BASE_VALUES_PATH = DIFFICULTY_DIRECTORY + 'BASE_VALUES.kitty';

export const DIFFICULTY_LEVELS = {
    EASY: 'baby',
    MEDIUM: 'kitten',
    HARD: 'lion'
};

let baseValues = null;
let currentDifficultySettings = null;

export const loadBaseValues = async () => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(BASE_VALUES_PATH);
        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(BASE_VALUES_PATH);
            baseValues = JSON.parse(content);
            return baseValues;
        }
        return getDefaultBaseValues();
    } catch (error) {
        console.error("Erreur au chargement des valeurs de base:", error);
        return getDefaultBaseValues();
    }
};

export const loadDifficultySettings = async (difficultyName) => {
    try {
        const filePath = `${DIFFICULTY_DIRECTORY}${difficultyName}.kitty`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(filePath);
            currentDifficultySettings = JSON.parse(content);
            return currentDifficultySettings;
        }
        return getDefaultDifficultySettings();
    } catch (error) {
        console.error("Erreur au chargement de la difficulté:", error);
        return getDefaultDifficultySettings();
    }
};

export const getGameConstants = async (difficultyName = DIFFICULTY_LEVELS.MEDIUM) => {
    if (!baseValues) {
        baseValues = await loadBaseValues();
    }

    const difficultySettings = await loadDifficultySettings(difficultyName);

    return {
        fullnessDecayPerSecond: baseValues.fullnessDecayPerSecond * difficultySettings.fullnessDecayMultiplier,
        happinessDecayPerSecond: baseValues.happinessDecayPerSecond * difficultySettings.happinessDecayMultiplier,
        feedingFullnessBoost: baseValues.feedingFullnessBoost * difficultySettings.feedingBoostMultiplier,
        feedingHappinessBoost: baseValues.feedingHappinessBoost * difficultySettings.feedingBoostMultiplier,
        playingHappinessBoost: baseValues.playingHappinessBoost * difficultySettings.playingBoostMultiplier,
        playingFullnessCost: baseValues.playingFullnessCost,
        healthDecayWhenHungry: baseValues.healthDecayWhenHungryPerSecond * difficultySettings.healthDecayMultiplier,
        difficultyDescription: difficultySettings.description
    };
};

const getDefaultBaseValues = () => ({
    fullnessDecayPerSecond: 0.0014,
    happinessDecayPerSecond: 0.0008,
    healthDecayWhenHungryPerSecond: 0.0006,
    feedingFullnessBoost: 30,
    feedingHappinessBoost: 5,
    playingHappinessBoost: 20,
    playingFullnessCost: 10
});

const getDefaultDifficultySettings = () => ({
    fullnessDecayMultiplier: 1.0,
    happinessDecayMultiplier: 1.0,
    feedingBoostMultiplier: 1.0,
    playingBoostMultiplier: 1.0,
    healthDecayMultiplier: 1.0,
    description: "Difficulté standard"
});