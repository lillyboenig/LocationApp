import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { firestore } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddLocationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');

  const addLocation = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);

    firestore
      .collection('locations')
      .add({
        name,
        description,
        rating: Number(rating),
        userEmail: user.email,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch(error => {
        alert('Error adding location: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Location</Text>
      <TextInput style={styles.input} placeholder="Location Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput
        style={styles.input}
        placeholder="Rating"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={addLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
});

export default AddLocationScreen;
