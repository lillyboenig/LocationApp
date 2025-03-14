import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import LocationsListScreen from './screens/LocationsListScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import MapScreen from './screens/MapScreen';
import CountriesScreen from './screens/CountriesScreen';
import { LocationProvider } from './context/LocationContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const userData = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!userData);
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="LocationsList" component={LocationsListScreen} options={{ title: 'Locations' }} />
          <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Add Location' }} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
          <Stack.Screen name="Countries" component={CountriesScreen} options={{ title: 'Countries' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LocationProvider>
  );
}
