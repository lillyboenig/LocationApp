import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { firestore } from '../firebase';
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
      const locationsRef = collection(firestore, 'locations');
      const q = query(locationsRef, where('userEmail', '==', user.email));
      const unsubscribe = onSnapshot(q, snapshot => {
        const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocations(locs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
  };

  const renderStars = (rating) => {
    // Assume rating is a number (e.g. 3 or 4.5)
    let stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`full-${i}`} name="star" size={16} color="#ffd700" />
      );
    }
    if (halfStar) {
      stars.push(
        <FontAwesome key="half" name="star-half-empty" size={16} color="#ffd700" />
      );
    }
    while (stars.length < totalStars) {
      stars.push(
        <FontAwesome key={`empty-${stars.length}`} name="star-o" size={16} color="#ffd700" />
      );
    }
    return stars;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Map', { location: item })}
      style={styles.itemContainer}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="location-pin" size={24} color="#ff6347" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Logout" onPress={handleLogout} />
        <Text style={styles.headerTitle}>Locations</Text>
      </View>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <Button title="Add Location" onPress={() => navigation.navigate('AddLocation')} />
        <Button title="Countries" onPress={() => navigation.navigate('Countries')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default LocationsListScreen;
