import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PostCardProps {
  image: any;
  onPress?: () => void;
}

export default function PostCard({ image, onPress }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 110,
    margin: 7,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
