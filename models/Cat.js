import { getDifficultySettings } from '../utils/FileUtils';

class Cat {
    constructor(id, name, breed, difficulty = 'normal') {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.difficulty = difficulty;

        // Stats (0-100)
        this.health = 100;
        this.fullness = 100;
        this.happiness = 100;

        this.lastUpdated = Date.now();
    }


    update() {
        const now = Date.now();
        const hoursPassed = (now - this.lastUpdated) / (1000 * 60 * 60);

        if (hoursPassed > 0) {
            const settings = getDifficultySettings(this.difficulty);

            this.fullness = Math.max(0, this.fullness - (2 * settings.fullnessDecayMultiplier * hoursPassed));
            this.happiness = Math.max(0, this.happiness - (1.5 * settings.happinessDecayMultiplier * hoursPassed));

            // Health decays faster if hunger or happiness are low
            const healthDecay = 0.5 * settings.healthDecayMultiplier * hoursPassed;
            const hungerPenalty = this.fullness < 30 ? (30 - this.fullness) / 10 : 0;
            const happinessPenalty = this.happiness < 30 ? (30 - this.happiness) / 15 : 0;

            this.health = Math.max(0, this.health - (healthDecay + hungerPenalty + happinessPenalty));

            this.lastUpdated = now;
        }

        return this.getStatus();
    }

    feed(foodValue) {
        const settings = getDifficultySettings(this.difficulty);
        this.fullness = Math.min(100, this.fullness + (foodValue * settings.feedingBoostMultiplier));
        this.happiness = Math.min(100, this.happiness + ((foodValue / 3) * settings.feedingBoostMultiplier));
        this.lastUpdated = Date.now();
        return this.getStatus();
    }

    play(activityValue) {
        const settings = getDifficultySettings(this.difficulty);
        this.happiness = Math.min(100, this.happiness + (activityValue * settings.playingBoostMultiplier));
        this.fullness = Math.max(0, this.fullness - ((activityValue / 4) * settings.playingBoostMultiplier));
        this.lastUpdated = Date.now();
        return this.getStatus();
    }

    heal(amount) {
        this.health = Math.min(100, this.health + amount);
        this.lastUpdated = Date.now();
        return this.getStatus();
    }


    getStatus() {
        return {
            id: this.id,
            name: this.name,
            breed: this.breed,
            health: this.health,
            fullness: this.fullness,
            happiness: this.happiness,
            difficulty: this.difficulty,
            lastUpdated: this.lastUpdated,
            mood: this.getMood()
        };
    }


    getMood() {
        if (this.health < 30) return 'sick';
        if (this.fullness < 30 || this.happiness < 30) return 'sad';
        if (this.fullness > 80 && this.happiness > 80) return 'happy';
        return 'content';
    }

    setDifficulty(difficulty) {
        if (['easy', 'normal', 'hard'].includes(difficulty)) {
            this.difficulty = difficulty;
        }
    }
}

export default Cat;