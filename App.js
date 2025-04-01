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
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'My Virtual Cats' }}
                />
                <Stack.Screen
                    name="CreateCat"
                    component={CreateCatScreen}
                    options={{ title: 'Create New Cat' }}
                />
                <Stack.Screen
                    name="Cat"
                    component={CatScreen}
                    options={({ route }) => ({
                        title: route.params?.catName || 'My Cat',
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Text style={{ color: 'red' }}>Home</Text>
                            </TouchableOpacity>
                        )
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}