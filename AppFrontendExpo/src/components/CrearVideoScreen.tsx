import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CrearVideoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sube tu video</Text>
      {/* Aquí puedes agregar el formulario, botón para seleccionar video, etc */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
