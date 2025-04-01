// src/services/storage/CatStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cat from '../../models/Cat';

const CAT_STORAGE_PREFIX = '@VirtualCat:';

class CatStorageService {
    static async saveCat(cat) {
        try {
            // Make sure we call update to get latest stats before saving
            const catData = JSON.stringify(cat.getStatus());
            await AsyncStorage.setItem(`${CAT_STORAGE_PREFIX}${cat.id}`, catData);
            console.log('Cat saved successfully:', cat.id);
            return true;
        } catch (error) {
            console.error('Error saving cat:', error);
            return false;
        }
    }

    static async loadCat(catId) {
        try {
            console.log('Loading cat with ID:', catId);
            const data = await AsyncStorage.getItem(`${CAT_STORAGE_PREFIX}${catId}`);
            if (!data) {
                console.log('No data found for cat ID:', catId);
                return null;
            }

            const catData = JSON.parse(data);
            const cat = new Cat(
                catData.id,
                catData.name,
                catData.breed,
                catData.difficulty || 'normal'
            );

            // Set the cat's stats
            cat.health = catData.health;
            cat.fullness = catData.fullness;
            cat.happiness = catData.happiness;
            cat.lastUpdated = catData.lastUpdated;

            // Apply updates (will adjust stats based on time passed)
            cat.update();

            console.log('Cat loaded successfully:', cat.id);
            return cat;
        } catch (error) {
            console.error('Error loading cat:', error);
            return null;
        }
    }

    static async getAllCats() {
        try {
            console.log('Getting all cats...');
            const keys = await AsyncStorage.getAllKeys();
            const catKeys = keys.filter(key => key.startsWith(CAT_STORAGE_PREFIX));

            const cats = [];
            for (const key of catKeys) {
                const catId = key.replace(CAT_STORAGE_PREFIX, '');
                const cat = await this.loadCat(catId);
                if (cat) {
                    cats.push(cat.getStatus()); // Just need the status for list view
                }
            }

            console.log('Found', cats.length, 'cats');
            return cats;
        } catch (error) {
            console.error('Error getting all cats:', error);
            return [];
        }
    }

    static async createNewCat(name, breed = 'Unknown', difficulty = 'normal') {
        const id = CatStorageService.generateId(); // Fix: Use the class name instead of this
        const cat = new Cat(id, name, breed, difficulty);
        await CatStorageService.saveCat(cat); // Fix: Use the class name instead of this
        return cat;
    }

    static async deleteCat(catId) {
        try {
            await AsyncStorage.removeItem(`${CAT_STORAGE_PREFIX}${catId}`);
            return true;
        } catch (error) {
            console.error('Error deleting cat:', error);
            return false;
        }
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

export default CatStorageService;
export const { saveCat, loadCat, getAllCats, createNewCat, deleteCat, generateId } = CatStorageService;