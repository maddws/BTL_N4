import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function LocationScreen() {
  const [location, setLocation] = useState({ lat: 21.0285, lng: 105.8542 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(getRandomLocation());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01}%2C${location.lat - 0.01}%2C${location.lng + 0.01}%2C${location.lat + 0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vị trí thú cưng</Text>
      <WebView
        source={{ uri: mapUrl }}
        style={styles.map}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
}

const getRandomLocation = () => {
  const baseLat = 21.0285;
  const baseLng = 105.8542;
  return {
    lat: baseLat + (Math.random() - 0.5) * 0.01,
    lng: baseLng + (Math.random() - 0.5) * 0.01,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  map: {
    flex: 1,
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
