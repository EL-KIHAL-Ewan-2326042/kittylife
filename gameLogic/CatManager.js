import { saveCat, loadCat } from '../services/FileStorageService';
import { getGameConstants, DIFFICULTY_LEVELS } from '../services/DifficultyService';
import Cat from '../models/Cat';

export default class CatManager {
    constructor(catName) {
        this.cat = null;
        this.catName = catName;
        this.gameConstants = null;
        this.difficulty = DIFFICULTY_LEVELS.MEDIUM;
    }

    async loadGameConstants() {
        this.gameConstants = await getGameConstants(this.difficulty);
    }


    async loadCat() {
        await this.loadGameConstants();
        this.cat = await loadCat(this.catName);
        if (!this.cat) {
            return false;
        }
        this.updateCatStats();
        return true;
    }

    async createNewCat() {
        await this.loadGameConstants();
        this.cat = new Cat(Date.now().toString(), this.catName);
        return await saveCat(this.cat);
    }

    updateCatStats() {
        if (!this.cat) return;

        const now = new Date();
        const lastUpdated = new Date(this.cat.lastUpdated);
        const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

        this.cat.fullness = Math.max(0, this.cat.fullness - (hoursDiff * 5));
        this.cat.happiness = Math.max(0, this.cat.happiness - (hoursDiff * 3));

        if (this.cat.fullness < 30) {
            this.cat.health = Math.max(0, this.cat.health - (hoursDiff * 2));
        }

        this.cat.lastUpdated = now.toISOString();
        saveCat(this.cat);
    }

    feedCat() {
        if (!this.cat) return false;
        this.cat.fullness = Math.min(100, this.cat.fullness + 30);
        this.cat.happiness += 5;
        saveCat(this.cat);
        return true;
    }

    playCat() {
        if (!this.cat) return false;
        this.cat.happiness = Math.min(100, this.cat.happiness + 20);
        this.cat.fullness = Math.max(0, this.cat.fullness - 10);
        saveCat(this.cat);
        return true;
    }

    isCatAlive() {
        return this.cat && this.cat.health > 0;
    }
}