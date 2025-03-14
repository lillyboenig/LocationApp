import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Dummy geocoding function for demonstration.
// In production, replace this with a call to a geocoding API such as the Google Geocoding API.
const geocodeLocation = async locationName => {
  // For example purposes, return fixed coordinates.
  return {
    latitude: 37.78825,
    longitude: -122.4324,
  };
};

const MapScreen = ({ route }) => {
  const { location } = route.params || {};
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (location) {
        const coords = await geocodeLocation(location.name);
        setRegion({
          ...coords,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // Default region if no location provided
        setRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };
    fetchCoordinates();
  }, [location]);

  if (!region) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <MapView style={styles.map} region={region}>
      {location && (
        <Marker
          coordinate={region}
          title={location.name}
          description={location.description}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
});

export default MapScreen;
