
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import StatusBarCustom from '../components/StatusBarCustom';
import BottomNav from '../components/BottomNav';
import VideoFeed from '../components/VideoFeed';
import MusicSection from '../components/MusicSection';
import StoreSection from '../components/StoreSection';
import ProfileSection from '../components/ProfileSection';


export default function HomeScreen() {
  const [activeSection, setActiveSection] = useState('videoFeed');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSectionChange = (section: string) => {
    if (section === 'create') {
      navigation.navigate('CrearVideoScreen');
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
  // ...existing code...
});
