// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import CreateCatScreen from './screens/CreateCatScreen';
import CatScreen from './screens/CatScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#4caf50',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Mes Chats Virtuels' }}
                />
                <Stack.Screen
                    name="CreateCat"
                    component={CreateCatScreen}
                    options={{ title: 'Créer un Chat' }}
                />
                <Stack.Screen
                    name="Cat"
                    component={CatScreen}
                    options={({ route, navigation }) => ({
                        title: route.params?.catName || 'Mon Chat',
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Text style={{ color: 'white' }}>Accueil</Text>
                            </TouchableOpacity>
                        )
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}