// Archivo renombrado a .jsx para soporte JSX
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function StatusBarCustom() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.left}>9:41</Text>
      <Text style={styles.right}>📶 📶 📶 🔋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 335,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
    borderRadius: 8,
  },
  left: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  right: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
