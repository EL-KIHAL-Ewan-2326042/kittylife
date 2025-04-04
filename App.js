import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import HomeScreen from './screens/HomeScreen';
import CatSelectionScreen from './screens/CatSelectionScreen';
import CreateCatScreen from './screens/CreateCatScreen';
import CatScreen from './screens/CatScreen';

const fetchFonts = () => {
    return Font.loadAsync({
        'rainyhearts': require('./assets/font/rainyhearts.ttf'),
        'pixelatedelegance': require('./assets/font/pixelatedelegance.ttf'),
    });
};

const Stack = createStackNavigator();

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    if (!fontsLoaded) {
        return (
            <AppLoading
                startAsync={fetchFonts}
                onFinish={() => setFontsLoaded(true)}
                onError={console.warn}
            />
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="CatSelection" component={CatSelectionScreen} />
                    <Stack.Screen name="CreateCat" component={CreateCatScreen} />
                    <Stack.Screen name="Cat" component={CatScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
