import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Cat from '../../models/Cat';

const STORAGE_KEY = '@KittyLife:cats';
const MAX_CATS = 3;

// Nouveaux niveaux de difficulté
const DIFFICULTY_LEVELS = {
    BABY: 'baby',
    KITTEN: 'kitten',
    LION: 'lion'
};

class StorageService {
    // Modifiez la méthode saveCat dans storageService.js
    static async saveCat(cat) {
        try {
            const cats = await this.getAllCats();

            // Extraire les données du chat si c'est un objet Cat, sinon utiliser directement
            const catData = typeof cat.getStatus === 'function' ? cat.getStatus() : cat;

            // Update or add the cat
            const existingCatIndex = cats.findIndex(c => c.id === catData.id);
            if (existingCatIndex >= 0) {
                cats[existingCatIndex] = catData;
            } else {
                if (cats.length >= MAX_CATS) {
                    throw new Error(`Vous ne pouvez pas avoir plus de ${MAX_CATS} chats.`);
                }
                cats.push(catData);
            }

            // Save all cats
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du chat:', error);
            throw error;
        }
    }

    static async createCat(name, breed, difficulty) {
        try {
            // Check if max cats limit reached
            const cats = await this.getAllCats();
            if (cats.length >= MAX_CATS) {
                throw new Error(`Vous ne pouvez pas avoir plus de ${MAX_CATS} chats.`);
            }

            // Vérification de la difficulté
            if (!Object.values(DIFFICULTY_LEVELS).includes(difficulty)) {
                difficulty = DIFFICULTY_LEVELS.KITTEN; // Valeur par défaut
            }

            // Create a new cat
            const newCat = new Cat(uuidv4(), name, breed, difficulty);

            // Save the cat
            await this.saveCat(newCat);

            return newCat;
        } catch (error) {
            console.error('Erreur lors de la création du chat:', error);
            throw error;
        }
    }

    static async getCat(catId) {
        try {
            const cats = await this.getAllCats();
            const catData = cats.find(cat => cat.id === catId);

            if (!catData) {
                return null;
            }

            // Créer une instance Cat avec les paramètres de base
            const cat = new Cat(
                catData.id,
                catData.name,
                catData.breed,
                catData.difficulty
            );

            // Restaurer toutes les propriétés importantes
            cat.health = catData.health;
            cat.fullness = catData.fullness;
            cat.hunger = catData.hunger;      // Assurez-vous que cette propriété existe
            cat.happiness = catData.happiness;
            cat.energy = catData.energy;      // Assurez-vous que cette propriété existe
            cat.lastUpdated = catData.lastUpdated;
            cat.created = catData.created || Date.now();
            cat.lastFed = catData.lastFed;    // Important pour tracking des repas

            cat.update(); // Mettre à jour le statut en fonction du temps écoulé

            return cat;
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
            return null;
        }
    }

    static async getAllCats() {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des chats:', error);
            return [];
        }
    }

    static async deleteCat(catId) {
        try {
            const cats = await this.getAllCats();
            const newCats = cats.filter(cat => cat.id !== catId);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCats));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du chat:', error);
            return false;
        }
    }

    static async exportCatsToJson() {
        try {
            const cats = await this.getAllCats();
            return JSON.stringify(cats, null, 2);
        } catch (error) {
            console.error('Erreur lors de l\'exportation des chats:', error);
            throw error;
        }
    }
}

export default StorageService;