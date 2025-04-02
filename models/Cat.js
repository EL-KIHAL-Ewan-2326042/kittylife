import { getDifficultySettings } from '../config/difficulties';

class Cat {
    constructor(id, name, breed, difficulty) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.difficulty = difficulty || 'kitten'; // Difficulté par défaut
        this.health = 100;
        this.fullness = 100;
        this.happiness = 100;
        this.lastUpdated = Date.now();
        this.created = Date.now();
    }

    update() {
        const now = Date.now();
        const secondsPassed = (now - this.lastUpdated) / 1000;

        if (secondsPassed <= 0) {
            return this;
        }

        const settings = getDifficultySettings(this.difficulty);
        const { BASE_RATES } = require('../config/difficulties');

        const fullnessDecayRate = BASE_RATES.fullnessDecay * settings.fullnessDecayMultiplier;
        const happinessDecayRate = BASE_RATES.happinessDecay * settings.happinessDecayMultiplier;
        const healthDecayRate = BASE_RATES.healthDecay * settings.healthDecayMultiplier;

        this.fullness = Math.max(0, this.fullness - secondsPassed * fullnessDecayRate);
        this.happiness = Math.max(0, this.happiness - secondsPassed * happinessDecayRate);

        const healthPenalty = (
            (this.fullness < 30 ? 1.5 : 0) +
            (this.happiness < 30 ? 1.5 : 0) +
            1
        );

        this.health = Math.max(0, this.health - secondsPassed * healthDecayRate * healthPenalty);
        this.lastUpdated = now;

        return this;
    }

    feed(foodValue, food = null) {
        this.update();

        const settings = getDifficultySettings(this.difficulty);

        const effectiveValue = foodValue;

        this.fullness = Math.min(100, this.fullness + effectiveValue);

        if (food) {
            switch (food.type) {
                case 'premium':
                    this.health = Math.min(100, this.health + settings.healingReward / 5);
                    break;
                case 'treat':
                    this.happiness = Math.min(100, this.happiness + settings.playingReward / 2);
                    break;
            }
        }

        this.lastFed = Date.now();
        this.lastUpdated = Date.now();

        return this;
    }

    play() {
        this.update();
        const settings = getDifficultySettings(this.difficulty);
        this.happiness = Math.min(100, this.happiness + settings.playingReward);
        this.lastUpdated = Date.now();
        return this;
    }

    heal() {
        this.update();
        const settings = getDifficultySettings(this.difficulty);
        this.health = Math.min(100, this.health + settings.healingReward);
        this.lastUpdated = Date.now();
        return this;
    }

    isAlive() {
        return this.health > 0;
    }

    getMood() {
        if (this.health < 20) return 'malade';
        if (this.fullness < 20) return 'affamé';
        if (this.happiness < 20) return 'triste';
        if (this.happiness > 80) return 'joyeux';
        return 'content';
    }

    getStatus() {
        return {
            id: this.id,
            name: this.name,
            breed: this.breed,
            difficulty: this.difficulty,
            health: this.health,
            fullness: this.fullness,
            happiness: this.happiness,
            lastUpdated: this.lastUpdated,
            created: this.created
        };
    }
}

export default Cat;