import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NAV_ITEMS = [
  { label: 'Videos', icon: '🎬', section: 'videoFeed' },
  { label: 'Música', icon: '🎵', section: 'musicSection' },
  { label: 'Crear', icon: '➕', section: 'create' },
  { label: 'Tienda', icon: '🛒', section: 'storeSection' },
  { label: 'Perfil', icon: '👤', section: 'profileSection' },
];

type BottomNavProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export default function BottomNav({ activeSection, onSectionChange }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item, idx) => (
        <TouchableOpacity
          key={item.section}
          style={[styles.navItem, activeSection === item.section && styles.active]}
          onPress={() => onSectionChange(item.section)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.9)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  navItem: {
    alignItems: 'center',
    opacity: 0.6,
    padding: 5,
  },
  active: {
    opacity: 1,
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: 'white',
  },
});
