// services/CatManager.js
import Cat from '../models/Cat';

export default class CatManager {
    constructor() {
        this.cats = [];
        this.nextId = 1;
    }

    addCat(name, breed) {
        const cat = new Cat(this.nextId++, name, breed);
        this.cats.push(cat);
        return cat;
    }

    getCat(id) {
        return this.cats.find(cat => cat.id === id) || null;
    }

    getAllCats() {
        return [...this.cats];
    }

    updateCat(id, updates) {
        const cat = this.getCat(id);
        if (!cat) return false;

        Object.keys(updates).forEach(key => {
            if (key in cat && key !== 'id') {
                cat[key] = updates[key];
            }
        });

        cat.updateTimestamp();
        return true;
    }

    deleteCat(id) {
        const index = this.cats.findIndex(cat => cat.id === id);
        if (index === -1) return false;

        this.cats.splice(index, 1);
        return true;
    }

    simulateTimePassage() {
        const now = new Date();

        this.cats.forEach(cat => {
            const lastUpdated = new Date(cat.lastUpdated);
            const hoursPassed = (now - lastUpdated) / (1000 * 60 * 60);

            if (hoursPassed > 1) {
                cat.fullness = Math.max(0, cat.fullness - (hoursPassed * 5));
                cat.happiness = Math.max(0, cat.happiness - (hoursPassed * 3));

                if (cat.fullness < 30 || cat.happiness < 20) {
                    cat.health = Math.max(0, cat.health - (hoursPassed * 2));
                }

                cat.updateTimestamp();
            }
        });
    }
}