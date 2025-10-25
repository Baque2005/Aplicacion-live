import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AlbumCardProps {
  title: string;
  artist: string;
  image: any;
  badge?: string;
  onPlay?: () => void;
}

export default function AlbumCard({ title, artist, image, badge, onPlay }: AlbumCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPlay}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
        <View style={styles.overlay}>
          <Text style={styles.playText}>▶</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    margin: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopLeftRadius: 12,
    padding: 6,
  },
  playText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
  artist: {
    color: '#aaa',
    fontSize: 13,
  },
});
