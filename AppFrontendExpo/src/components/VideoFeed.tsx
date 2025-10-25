// Archivo renombrado a .jsx para soporte JSX

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated, Easing, ScrollView, Image, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Asegúrate de tener instalado @react-navigation/native
// Si ves este error, ejecuta en la raíz de tu proyecto:
// npm install @react-navigation/native
// o
// yarn add @react-navigation/native

// Si usas TypeScript, instala también los tipos:
// npm install --save-dev @types/react @types/react-native

// Si usas Expo, ejecuta además:
// npx expo install react-native-screens react-native-safe-area-context

const TABS = [
  { key: 'para-ti', label: 'Para Ti' },
  { key: 'explorar', label: 'Explorar' },
  { key: 'crear', label: 'Crear' }, // Nueva pestaña
  { key: 'live', label: 'Live' },
];

const VIDEO_DATA = [
  {
    id: '1',
    user: '@usuario_creativo',
    desc: '¡Mira este increíble baile! #viral #dance #trending',
    likes: '12.5K',
    comments: '1.2K',
    shares: '856',
  },
  {
    id: '2',
    user: '@musico_talentoso',
    desc: 'Cover de mi canción favorita #music #cover #guitar',
    likes: '8.9K',
    comments: '567',
    shares: '234',
  },
  {
    id: '3',
    user: '@chef_casero',
    desc: 'Receta rápida de pasta - Solo 15 minutos! #cooking #recipe',
    likes: '15.2K',
    comments: '2.1K',
    shares: '1.5K',
  },
];

const LIVE_DATA = [
  {
    id: 'gaming',
    emoji: '🎮',
    title: 'Gaming Session Épica',
    user: '@gamer_pro',
    viewers: '2.5K',
  },
  {
    id: 'art',
    emoji: '🎨',
    title: 'Arte en Directo',
    user: '@artista_digital',
    viewers: '1.8K',
  },
  {
    id: 'cooking',
    emoji: '🍳',
    title: 'Cocinando en Casa',
    user: '@chef_live',
    viewers: '3.2K',
  },
];

// Simulación de usuarios seguidos
const initialFollowed: { [id: string]: boolean } = {};
VIDEO_DATA.forEach(v => { initialFollowed[v.id] = false; });

// Agrega las fuentes de imágenes estáticas (puedes cambiar las URLs por las que quieras)
const IMAGE_SOURCES = [
  { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' },
];

// Altura de la barra inferior de navegación (ajusta según tu diseño real)
const BOTTOM_BAR_HEIGHT = 80;

export default function VideoFeed() {
  const [activeTab, setActiveTab] = useState('para-ti');
  const [liked, setLiked] = useState<{ [id: string]: boolean }>({});
  const [likeAnim, setLikeAnim] = useState<{ [id: string]: boolean }>({});
  const [paused, setPaused] = useState<{ [id: string]: boolean }>({});
  const [showLikeTooltip, setShowLikeTooltip] = useState<{ [id: string]: boolean }>({});
  const [followed, setFollowed] = useState<{ [id: string]: boolean }>(initialFollowed);
  // Estado para el índice del video actualmente visible
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animación de gradiente de fondo
  const gradientAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [gradientAnim]);

  // Interpolación de colores para gradiente animado
  const gradientColors = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      'rgba(255,107,107,1)',
      'rgba(76,205,196,1)',
      'rgba(69,183,209,1)',
    ],
  });

  // Animaciones por video: refs y efectos fuera del map
  // Usar useRef para asegurar que los arrays no cambian nunca
  const scaleAnims = useRef(VIDEO_DATA.map(() => new Animated.Value(1))).current;
  const likeScales = useRef(VIDEO_DATA.map(() => new Animated.Value(1))).current;
  const fadeAnims = useRef(VIDEO_DATA.map(() => new Animated.Value(0))).current;

  // Animación de fade-in para cada video SOLO al montar
  useEffect(() => {
    fadeAnims.forEach(fadeAnim => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false, // <-- aquí
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animaciones de like
  useEffect(() => {
    VIDEO_DATA.forEach((video, idx) => {
      if (likeAnim[video.id]) {
        Animated.sequence([
          Animated.spring(likeScales[idx], {
            toValue: 1.4,
            useNativeDriver: false, // <-- aquí
          }),
          Animated.spring(likeScales[idx], {
            toValue: 1,
            useNativeDriver: false, // <-- aquí
          }),
        ]).start();
        setShowLikeTooltip(prev => ({ ...prev, [video.id]: true }));
        setTimeout(() => setShowLikeTooltip(prev => ({ ...prev, [video.id]: false })), 900);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likeAnim]);

  const handleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setLikeAnim(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setLikeAnim(prev => ({ ...prev, [id]: false })), 250);
  };

  const handleTogglePause = (id: string) => {
    setPaused(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFollow = (id: string) => {
    setFollowed(prev => ({ ...prev, [id]: true }));
  };

  const handlePressIn = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 0.96,
      useNativeDriver: false, // <-- aquí
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 1,
      useNativeDriver: false, // <-- aquí
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const TAB_BAR_HEIGHT = 48;
  const fullScreenVideoHeight = windowHeight - BOTTOM_BAR_HEIGHT - TAB_BAR_HEIGHT;

  // Determina el alto de cada ítem según la pestaña activa
  const itemHeight = activeTab === 'para-ti' ? fullScreenVideoHeight : 370;

  const navigation = useNavigation<any>(); // <-- Cambia aquí para evitar el error de tipos

  return (
    <View style={styles.section}>
      {/* Barra superior de pestañas */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => {
              if (tab.key === 'crear') {
                navigation.navigate('CrearVideoScreen'); // <-- Esto ya funcionará sin error de tipos
              } else {
                setActiveTab(tab.key);
              }
            }}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      {activeTab !== 'live' ? (
        <FlatList
          data={VIDEO_DATA}
          keyExtractor={item => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          onViewableItemsChanged={React.useRef(({
            viewableItems,
          }: {
            viewableItems: Array<ViewToken>;
            changed: Array<ViewToken>;
          }) => {
            if (viewableItems && viewableItems.length > 0) {
              setCurrentIndex(viewableItems[0].index ?? 0);
            }
          }).current}
          viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
          renderItem={({ item: video, index: idx }) => {
            const isLiked = liked[video.id];
            const isPaused = paused[video.id];
            const isFollowed = followed[video.id];
            const showTooltip = showLikeTooltip[video.id];
            const isFullScreen = activeTab === 'para-ti';
            const isActive = idx === currentIndex;
            return (
              <View
                style={[
                  styles.videoItemWrap,
                  isFullScreen
                    ? {
                        height: fullScreenVideoHeight,
                        width: windowWidth,
                        margin: 0,
                        padding: 0,
                      }
                    : { width: windowWidth }
                ]}
              >
                <Animated.View
                  style={[
                    styles.videoItem,
                    isFullScreen
                      ? {
                          width: windowWidth,
                          height: fullScreenVideoHeight,
                          margin: 0,
                          borderRadius: 0,
                          overflow: 'hidden',
                        }
                      : { width: windowWidth * 0.96, maxWidth: 600 },
                    { backgroundColor: gradientColors, transform: [{ scale: scaleAnims[idx] }], opacity: fadeAnims[idx] },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    onPressIn={() => handlePressIn(idx)}
                    onPressOut={() => handlePressOut(idx)}
                    onPress={() => handleTogglePause(video.id)}
                  >
                    <View style={[
                      styles.videoEmojiBox,
                      isFullScreen && { justifyContent: 'flex-end', alignItems: 'flex-start', padding: 0 }
                    ]}>
                      <Image
                        source={IMAGE_SOURCES[idx % IMAGE_SOURCES.length]}
                        style={[
                          styles.videoPlayer,
                          {
                            width: '100%',
                            height: '100%',
                            minHeight: 200,
                            maxHeight: fullScreenVideoHeight,
                            maxWidth: windowWidth,
                          }
                        ]}
                        resizeMode="cover"
                      />
                    </View>
                    {/* Botones de interacción flotantes y descripción solo en el video activo */}
                    {isFullScreen && isActive && (
                      <>
                        <View style={styles.tiktokActionsFloatWrap} pointerEvents="box-none">
                          <View style={styles.tiktokActionsColumn}>
                            <View style={styles.actionCol}>
                              <TouchableOpacity
                                style={[
                                  styles.actionBtn,
                                  isLiked && styles.actionBtnLiked,
                                ]}
                                onPress={() => handleLike(video.id)}
                                activeOpacity={0.7}
                              >
                                <Animated.Text style={[
                                  styles.actionIcon,
                                  isLiked && styles.actionIconLiked,
                                  { transform: [{ scale: likeScales[idx] }] },
                                ]}>❤️</Animated.Text>
                              </TouchableOpacity>
                              <Text style={styles.tiktokActionCount}>{video.likes}</Text>
                              {showTooltip && (
                                <Animated.View style={[styles.likeTooltip, {
                                  left: '50%', marginLeft: -30
                                }]}
                                >
                                  <Text style={styles.likeTooltipText}>¡Te gusta!</Text>
                                </Animated.View>
                              )}
                            </View>
                            <View style={styles.actionCol}>
                              <TouchableOpacity style={styles.actionBtn}>
                                <Text style={styles.actionIcon}>💬</Text>
                              </TouchableOpacity>
                              <Text style={styles.tiktokActionCount}>{video.comments}</Text>
                            </View>
                            <View style={styles.actionCol}>
                              <TouchableOpacity style={styles.actionBtn}>
                                <Text style={styles.actionIcon}>📤</Text>
                              </TouchableOpacity>
                              <Text style={styles.tiktokActionCount}>{video.shares}</Text>
                            </View>
                            <View style={styles.actionCol}>
                              <TouchableOpacity style={styles.actionBtn}>
                                <Text style={styles.actionIcon}>🔖</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        {/* Descripción flotante más arriba del menú */}
                        <View style={styles.tiktokInfoFloatWrapActive} pointerEvents="box-none">
                          <View style={styles.tiktokInfoBox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={styles.videoUser}>{video.user}</Text>
                              {!isFollowed && (
                                <TouchableOpacity style={styles.followBtn} onPress={() => handleFollow(video.id)}>
                                  <Text style={styles.followBtnText}>Seguir</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                            <Text style={styles.videoDesc}>{video.desc}</Text>
                          </View>
                        </View>
                      </>
                    )}
                    {/* Overlay inferior solo si NO es pantalla completa */}
                    {!isFullScreen && (
                      <View style={styles.videoOverlay}>
                        <View style={styles.videoInfo}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.videoUser}>{video.user}</Text>
                            {!isFollowed && (
                              <TouchableOpacity style={styles.followBtn} onPress={() => handleFollow(video.id)}>
                                <Text style={styles.followBtnText}>Seguir</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <Text style={styles.videoDesc}>{video.desc}</Text>
                        </View>
                        <View style={styles.actionsColumn}>
                          <View style={styles.actionCol}>
                            <TouchableOpacity
                              style={[styles.actionBtn, isLiked && styles.actionBtnLiked]}
                              onPress={() => handleLike(video.id)}
                              activeOpacity={0.7}
                            >
                              <Animated.Text style={[styles.actionIcon, isLiked && styles.actionIconLiked, { transform: [{ scale: likeScales[idx] }] }]}>❤️</Animated.Text>
                            </TouchableOpacity>
                            <Text style={styles.actionCount}>{video.likes}</Text>
                            {showTooltip && (
                              <Animated.View style={[styles.likeTooltip, { left: '50%', marginLeft: -30 }]}
                              >
                                <Text style={styles.likeTooltipText}>¡Te gusta!</Text>
                              </Animated.View>
                            )}
                          </View>
                          <View style={styles.actionCol}>
                            <TouchableOpacity style={styles.actionBtn}>
                              <Text style={styles.actionIcon}>💬</Text>
                            </TouchableOpacity>
                            <Text style={styles.actionCount}>{video.comments}</Text>
                          </View>
                          <View style={styles.actionCol}>
                            <TouchableOpacity style={styles.actionBtn}>
                              <Text style={styles.actionIcon}>📤</Text>
                            </TouchableOpacity>
                            <Text style={styles.actionCount}>{video.shares}</Text>
                          </View>
                          <View style={styles.actionCol}>
                            <TouchableOpacity style={styles.actionBtn}>
                              <Text style={styles.actionIcon}>🔖</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }}
        />
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Math.max(windowWidth * 0.05, 10), paddingBottom: 100 }}>
          <Text style={styles.liveTitle}>🔴 Transmisiones en Vivo</Text>
          {LIVE_DATA.map(live => (
            <View key={live.id} style={styles.liveItem}>
              <View style={styles.liveEmojiBox}>
                <Text style={styles.liveEmoji}>{live.emoji}</Text>
                <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>EN VIVO</Text></View>
                <View style={styles.liveViewers}><Text style={styles.liveViewersText}>👁️ {live.viewers}</Text></View>
                <View style={styles.liveInfoBox}>
                  <Text style={styles.liveTitleText}>{live.title}</Text>
                  <Text style={styles.liveUserText}>{live.user}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {/* Si tienes una barra inferior de navegación, agrégala aquí y dale fondo opaco */}
      {/* <View style={styles.bottomBar} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black', // Fondo negro para evitar fugas de imagen
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,1)', // Fondo completamente opaco
    paddingVertical: 10,
    gap: 30,
    zIndex: 100,
    width: '100%',
    minHeight: 48, // Asegura altura consistente
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 5,
    position: 'relative',
    minWidth: 60,
  },
  tabActive: {},
  tabLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 15,
  },
  tabLabelActive: {
    color: 'white',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ff6b6b',
    borderRadius: 1,
    marginTop: 2,
  },
  videoItemWrap: {
    margin: 0,
    marginBottom: 0,
    padding: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoItem: {
    height: 350,
    borderRadius: 18,
    marginHorizontal: '2%',
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    width: '96%',
    maxWidth: 600,
  },
  videoEmojiBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    maxWidth: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoUser: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  videoDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    flexWrap: 'wrap',
    maxWidth: '95%',
  },
  // Nueva columna de acciones tipo TikTok
  actionsColumn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginRight: 2,
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  // Acciones flotantes TikTok (pantalla completa)
  tiktokActionsFloatWrap: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 80,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  tiktokActionsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    width: 70,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  tiktokActionCount: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Info flotante TikTok (pantalla completa)
  tiktokInfoFloatWrap: {
    position: 'absolute',
    left: 0,
    right: 90,
    bottom: 0,
    padding: 18,
    zIndex: 15,
    pointerEvents: 'box-none',
  },
  // Versión activa: más arriba del menú
  tiktokInfoFloatWrapActive: {
    position: 'absolute',
    left: 0,
    right: 90,
    bottom: 90, // deja espacio extra sobre el menú
    padding: 18,
    zIndex: 15,
    pointerEvents: 'box-none',
  },
  tiktokInfoBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 30,
    maxWidth: '80%',
  },
  actionCol: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionBtnLiked: {
    backgroundColor: 'rgba(255,107,107,0.8)',
    borderColor: '#ff6b6b',
  },
  actionIcon: {
    fontSize: 22,
    color: 'white',
  },
  actionIconLiked: {
    color: '#ff6b6b',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  actionCount: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  // --- NUEVOS ESTILOS ---
  playPauseOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playPauseIcon: {
    fontSize: 38,
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  followBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  followBtnText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 13,
  },
  likeTooltip: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 20,
  },
  likeTooltipText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // --- FIN NUEVOS ESTILOS ---
  liveTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  liveItem: {
    marginBottom: 18,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  liveEmojiBox: {
    height: Math.max(Dimensions.get('window').height * 0.25, 120),
    backgroundColor: '#333',
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  liveEmoji: {
    fontSize: 48,
    color: 'white',
  },
  liveBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#ff4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  liveViewers: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  liveViewersText: {
    color: 'white',
    fontSize: 12,
  },
  liveInfoBox: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  liveTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  liveUserText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
