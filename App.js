import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './screens/HomeScreen';
import CreateCatScreen from './screens/CreateCatScreen';
import CatScreen from './screens/CatScreen';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true); // Barre de statut translucide
            StatusBar.setBackgroundColor('transparent'); // Transparence pour la barre de statut
            StatusBar.setBarStyle('dark-content'); // Icônes sombres pour la barre de statut

            // Fix de la barre de navigation avec une couleur personnalisée
            const setNavigationColor = async () => {
                try {
                    await import('expo-navigation-bar').then(({ setBackgroundColorAsync, setButtonStyleAsync }) => {
                        setBackgroundColorAsync('#fefbed'); // Couleur claire personnalisée
                        setButtonStyleAsync('dark'); // Icônes sombres pour la barre de navigation
                    });
                } catch (error) {
                    console.log("NavigationBar indisponible sur Expo Go");
                }
            };

            setNavigationColor();
        }
    }, []);

    const screenOptions = {
        headerStyle: {
            backgroundColor: '#4caf50', // Couleur du header
            elevation: 0,
            shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
    };

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mes Chats Virtuels' }} />
                    <Stack.Screen name="CreateCat" component={CreateCatScreen} options={{ title: 'Créer un Chat' }} />
                    <Stack.Screen name="Cat" component={CatScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
