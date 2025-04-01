import { getDifficultySettings } from '../config/difficulties';

// src/models/Cat.js
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

        // Si aucun temps n'est passé, ne pas mettre à jour
        if (secondsPassed <= 0) {
            return this;
        }

        // Utiliser les paramètres de difficulté
        const settings = getDifficultySettings(this.difficulty);

        // baby: -1 toutes les 10s, kitten: -1 toutes les 5s, lion: -1 toutes les 2s
        const fullnessDecayRate = (1/10) * settings.fullnessDecayMultiplier;
        const happinessDecayRate = (1/15) * settings.happinessDecayMultiplier;
        const healthDecayRate = (1/20) * settings.healthDecayMultiplier;

        this.fullness = Math.max(0, this.fullness - secondsPassed * fullnessDecayRate);
        this.happiness = Math.max(0, this.happiness - secondsPassed * happinessDecayRate);

        const healthPenalty = (
            (this.fullness < 30 ? 1.5 : 0) +
            (this.happiness < 30 ? 1.5 : 0) +
            1 // Diminution de base
        );

        this.health = Math.max(0, this.health - secondsPassed * healthDecayRate * healthPenalty);
        this.lastUpdated = now;

        return this;
    }

// Dans models/Cat.js, ajoutez cette méthode
    feed(value, food = null) {
        // Mettre à jour l'état du chat après avoir été nourri
        this.update(); // Mise à jour avant de nourrir

        // Appliquer les effets de la nourriture selon la difficulté
        const feedingMultiplier = this.difficulty?.feedingBoostMultiplier || 1.0;

        // Mise à jour des attributs
        this.energy = Math.min(100, (this.energy || 0) + (value * feedingMultiplier));
        this.hunger = Math.max(0, (this.hunger || 100) - (value * 1.5 * feedingMultiplier));

        // Modifier la plénitude (fullness) en fonction de la nourriture
        this.fullness = Math.min(100, (this.fullness || 0) + (value * feedingMultiplier));

        // Effets spéciaux selon le type de nourriture
        if (food) {
            switch (food.type) {
                case 'premium':
                    this.health = Math.min(100, (this.health || 0) + 5);
                    break;
                case 'treat':
                    this.happiness = Math.min(100, (this.happiness || 0) + 10);
                    break;
            }
        }

        // Mettre à jour le timestamp du dernier repas
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

    // Pour la compatibilité avec StatusBars component
    get hunger() {
        return this.fullness;
    }
}

export default Cat;