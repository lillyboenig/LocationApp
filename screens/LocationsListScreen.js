import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationContext } from '../context/LocationContext';

const LocationsListScreen = ({ navigation }) => {
  const { locations, setLocations } = useContext(LocationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch locations from Firestore that belong to the logged in user
      const unsubscribe = firestore
        .collection('locations')
        .where('userEmail', '==', user.email)
        .onSnapshot(snapshot => {
          const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLocations(locs);
        });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Map', { location: item })}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text>Rating: {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Button title="Logout" onPress={handleLogout} />
      <FlatList data={locations} keyExtractor={item => item.id} renderItem={renderItem} />
      <Button title="Add Location" onPress={() => navigation.navigate('AddLocation')} />
      <Button title="Countries" onPress={() => navigation.navigate('Countries')} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default LocationsListScreen;
