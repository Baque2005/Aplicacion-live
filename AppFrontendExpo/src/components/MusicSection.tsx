// Archivo renombrado a .jsx para soporte JSX

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import SearchBar from './SearchBar';
import Chip from './Chip';
import AlbumCard from './AlbumCard';

const categories = [
  'Pop', 'Rock', 'Electrónica', 'Latina', 'Indie', 'Jazz', 'Clásica', 'Reggaetón', 'Rap', 'Otros'
];

const albums = [
  {
    title: 'Sueños',
    artist: 'Juanes',
    image: require('../../assets/icon.png'),
    badge: 'Nuevo',
  },
  {
    title: 'Rock & Love',
    artist: 'Soda Stereo',
    image: require('../../assets/adaptive-icon.png'),
    badge: 'Top',
  },
  {
    title: 'Electro Vibes',
    artist: 'DJ Luna',
    image: require('../../assets/favicon.png'),
  },
  {
    title: 'Clásicos',
    artist: 'Mozart',
    image: require('../../assets/splash-icon.png'),
    badge: 'Recomendado',
  },
  {
    title: 'Latino Power',
    artist: 'Shakira',
    image: require('../../assets/icon.png'),
  },
  {
    title: 'Indie Dreams',
    artist: 'Zoé',
    image: require('../../assets/adaptive-icon.png'),
  },
];

export default function MusicSection() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  // Filtrar álbumes por búsqueda y categoría (simulado)
  const filteredAlbums = albums.filter(
    a =>
      (a.title.toLowerCase().includes(search.toLowerCase()) || a.artist.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === 'Otros' || a.title.toLowerCase().includes(selectedCategory.toLowerCase()) || a.artist.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  const handlePlay = (album: any) => {
    setSelectedAlbum(album);
    setModalVisible(true);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Música</Text>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar música..." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {categories.map(cat => (
          <Chip
            key={cat}
            label={cat}
            selected={cat === selectedCategory}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.grid}>
        <View style={styles.gridRow}>
          {filteredAlbums.map((album, idx) => (
            <AlbumCard
              key={idx}
              title={album.title}
              artist={album.artist}
              image={album.image}
              badge={album.badge}
              onPlay={() => handlePlay(album)}
            />
          ))}
        </View>
        {filteredAlbums.length === 0 && (
          <Text style={styles.noResults}>No se encontraron álbumes.</Text>
        )}
      </ScrollView>

      {/* Modal de reproducción */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedAlbum && (
              <>
                <Image source={selectedAlbum.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedAlbum.title}</Text>
                <Text style={styles.modalArtist}>{selectedAlbum.artist}</Text>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 2,
  },
  chipScroll: {
    marginBottom: 10,
    maxHeight: 44,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  noResults: {
    color: '#888',
    fontSize: 16,
    marginTop: 30,
    alignSelf: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalBox: {
    backgroundColor: '#222',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 18,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalArtist: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
