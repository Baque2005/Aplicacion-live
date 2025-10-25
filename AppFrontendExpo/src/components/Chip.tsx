import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  selected: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  label: {
    color: '#fff',
    fontSize: 15,
  },
  selectedLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
