import * as FileSystem from 'expo-file-system';
import Cat from '../models/Cat';

const CATS_DIRECTORY = FileSystem.documentDirectory + 'data/cats/';
const PREFERENCES_PATH = FileSystem.documentDirectory + 'data/preferences.json';

const ensureDirectoryExists = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(CATS_DIRECTORY);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(CATS_DIRECTORY, { intermediates: true });
        }
    } catch (error) {
        console.error("Erreur lors de la recherche du dossier : ", error);
    }
};

export const saveCat = async (cat) => {
    try {
        await ensureDirectoryExists();
        const filePath = `${CATS_DIRECTORY}${cat.name.toLowerCase()}.cat`;
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(cat));
        console.log(`Cat saved to ${filePath}`);
        return true;
    } catch (error) {
        console.error("Erreur à la sauvegarde du chat : ", error);
        return false;
    }
};

export const loadCat = async (catName) => {
    try {
        const filePath = `${CATS_DIRECTORY}${catName.toLowerCase()}.cat`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(filePath);
            return JSON.parse(content);
        }
        return null;
    } catch (error) {
        console.error("Erreur au chargement du chat : ", error);
        return null;
    }
};

export const savePreferences = async (preferences) => {
    try {
        await ensureDirectoryExists();
        await FileSystem.writeAsStringAsync(PREFERENCES_PATH, JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des préférences : :", error);
        return false;
    }
};

export const loadPreferences = async () => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(PREFERENCES_PATH);
        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(PREFERENCES_PATH);
            return JSON.parse(content);
        }
        return getDefaultPreferences();
    } catch (error) {
        console.error("Erreur lors du chargement des préférences : ", error);
        return getDefaultPreferences();
    }
};

const getDefaultPreferences = () => ({
    difficulty: 'normal',
});