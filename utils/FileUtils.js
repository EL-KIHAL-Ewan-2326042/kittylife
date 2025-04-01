// src/utils/FileUtils.js
// Import directly works now with our transformer
import babyKitty from '../data/difficulties/baby.kitty';
import kittenKitty from '../data/difficulties/kitten.kitty';
import lionKitty from '../data/difficulties/lion.kitty';

export const getDifficultySettings = (difficultyName) => {
    switch (difficultyName) {
        case 'easy':
            return babyKitty;
        case 'normal':
            return kittenKitty;
        case 'hard':
            return lionKitty;
        default:
            return kittenKitty;
    }
};