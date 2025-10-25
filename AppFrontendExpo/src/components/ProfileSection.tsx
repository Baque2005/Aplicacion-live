// Archivo renombrado a .jsx para soporte JSX

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import PostCard from './PostCard';

const user = {
  name: 'María López',
  avatar: require('../../assets/icon.png'),
  posts: 12,
  followers: 340,
  following: 180,
};

const posts = [
  { image: require('../../assets/adaptive-icon.png') },
  { image: require('../../assets/favicon.png') },
  { image: require('../../assets/splash-icon.png') },
  { image: require('../../assets/icon.png') },
  { image: require('../../assets/adaptive-icon.png') },
  { image: require('../../assets/favicon.png') },
];

export default function ProfileSection() {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePostPress = (post: any) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.section}>
      <View style={styles.header}>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statNum}>{user.posts}</Text><Text style={styles.statLabel}>Publicaciones</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{user.followers}</Text><Text style={styles.statLabel}>Seguidores</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{user.following}</Text><Text style={styles.statLabel}>Siguiendo</Text></View>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Editar perfil</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}><Text style={styles.btnOutlineText}>Compartir</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.gridTitle}>Publicaciones</Text>
      <View style={styles.gridRow}>
        {posts.map((post, idx) => (
          <PostCard key={idx} image={post.image} onPress={() => handlePostPress(post)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 12,
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 18,
  },
  statNum: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnOutline: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  btnOutlineText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
});
