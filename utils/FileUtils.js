// src/utils/FileUtils.js
const babyKitty = require('../data/difficulties/baby.json');
const kittenKitty = require('../data/difficulties/kitten.json');
const lionKitty = require('../data/difficulties/lion.json');

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