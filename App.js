import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import CatSelectionScreen from './screens/CatSelectionScreen';
import CreateCatScreen from './screens/CreateCatScreen';
import CatScreen from './screens/CatScreen';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        // Le reste du code useEffect reste identique
    }, []);

    const screenOptions = {
        // Le reste du code screenOptions reste identique
    };

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" />
            <NavigationContainer
                onStateChange={(state) => {
                    console.log("Navigation state changed");
                }}
            >
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={screenOptions}
                    screenListeners={{
                        gestureStart: (e) => {
                            if (Platform.OS === 'android') {
                                e.preventDefault();
                            }
                        }
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="CatSelection" component={CatSelectionScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateCat" component={CreateCatScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Cat" component={CatScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}