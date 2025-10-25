// Archivo renombrado a .jsx para soporte JSX

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import SearchBar from './SearchBar';
import Chip from './Chip';
import ProductCard from './ProductCard';

const categories = [
  'Tecnología', 'Moda', 'Hogar', 'Juguetes', 'Deportes', 'Libros', 'Belleza', 'Otros'
];

const products = [
  {
    title: 'Auriculares Bluetooth',
    price: '$499',
    image: require('../../assets/icon.png'),
    badge: 'Nuevo',
  },
  {
    title: 'Camiseta Rock',
    price: '$299',
    image: require('../../assets/adaptive-icon.png'),
    badge: 'Oferta',
  },
  {
    title: 'Lámpara LED',
    price: '$199',
    image: require('../../assets/favicon.png'),
  },
  {
    title: 'Pelota fútbol',
    price: '$150',
    image: require('../../assets/splash-icon.png'),
    badge: 'Top',
  },
  {
    title: 'Libro: Sueños',
    price: '$120',
    image: require('../../assets/icon.png'),
  },
  {
    title: 'Perfume',
    price: '$350',
    image: require('../../assets/adaptive-icon.png'),
  },
];

export default function StoreSection() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Filtrar productos por búsqueda y categoría (simulado)
  const filteredProducts = products.filter(
    p =>
      (p.title.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === 'Otros' || p.title.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tienda</Text>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar productos..." />
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
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={idx}
              title={product.title}
              price={product.price}
              image={product.image}
              badge={product.badge}
              onPress={() => handleProductPress(product)}
            />
          ))}
        </View>
        {filteredProducts.length === 0 && (
          <Text style={styles.noResults}>No se encontraron productos.</Text>
        )}
      </ScrollView>

      {/* Modal de producto */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedProduct && (
              <>
                <Image source={selectedProduct.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
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
  modalPrice: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
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
