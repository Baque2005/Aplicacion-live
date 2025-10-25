
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StatusBarCustom from '../components/StatusBarCustom';
import BottomNav from '../components/BottomNav';
import VideoFeed from '../components/VideoFeed';
import MusicSection from '../components/MusicSection';
import StoreSection from '../components/StoreSection';
import ProfileSection from '../components/ProfileSection';


export default function HomeScreen() {
  const [activeSection, setActiveSection] = useState('videoFeed');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSectionChange = (section: string) => {
    if (section === 'create') {
      setShowCreateModal(true);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      {activeSection === 'videoFeed' && <VideoFeed />}
      {activeSection === 'musicSection' && <MusicSection />}
      {activeSection === 'storeSection' && <StoreSection />}
      {activeSection === 'profileSection' && <ProfileSection />}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{color: 'white', fontSize: 18, marginBottom: 20}}>Crear contenido (modal simulado)</Text>
            <Text style={{color: 'white', marginBottom: 20}}>Aquí iría la interfaz de creación de video o publicación.</Text>
            <Text style={styles.closeBtn} onPress={() => setShowCreateModal(false)}>Cerrar</Text>
          </View>
        </View>
      )}
      <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalBox: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: 300,
  },
  closeBtn: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    padding: 10,
  },
});
