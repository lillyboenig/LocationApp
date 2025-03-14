import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CountriesScreen = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      alert('Error fetching countries: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country => {
    const countryName = country.name.common.toLowerCase();
    const capital = country.capital ? country.capital[0].toLowerCase() : '';
    return (
      countryName.includes(search.toLowerCase()) ||
      capital.includes(search.toLowerCase())
    );
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Search by country or capital"
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={item => item.cca3}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.name.common}</Text>
              <Text>Capital: {item.capital ? item.capital[0] : 'N/A'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontWeight: 'bold' },
});

export default CountriesScreen;
