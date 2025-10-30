// Componente para acción de LIVE y su interfaz
interface LiveActionProps {
  icon: string;
  label: string;
  dot?: boolean;
}

// Helpers para responsividad
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const vScale = (size: number) => (SCREEN_HEIGHT / 812) * size;

const LiveAction: React.FC<LiveActionProps> = (props) => {
  return (
    <TouchableOpacity
      style={[styles.liveActionBtn, { width: scale(42), height: scale(42) }]}
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <Text style={[styles.liveActionIcon, { fontSize: scale(18) }]}>{props.icon}</Text>
      {props.dot && <View style={styles.liveActionDot} />}
      {SCREEN_WIDTH > 340 && (
        <Text
          style={[styles.liveActionLabel, { fontSize: scale(10.5), maxWidth: scale(44) }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Switch, Platform, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function CrearVideoScreen() {
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const [desc, setDesc] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'publicacion' | 'live'>('publicacion');
  const [liveMobileTab, setLiveMobileTab] = useState<'opciones' | 'live'>('opciones');
  const [liveMobileTitle, setLiveMobileTitle] = useState('');
  const [liveMobileImage, setLiveMobileImage] = useState<string | null>(null);
  // Nuevo: para animación de portada y botón publicar
  const [showPublish, setShowPublish] = useState(false);
  // Nuevo: estado para activar la tienda
  const [tiendaActiva, setTiendaActiva] = useState(false);

  const pickMedia = async () => {
    setError('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.9,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setMedia({ uri: asset.uri, type: asset.type === 'video' ? 'video' : 'image' });
    }
  };

  const handlePublish = async () => {
    setUploading(true);
    setError('');
    // Aquí iría la lógica real de subida a backend
    setTimeout(() => {
      setUploading(false);
      setMedia(null);
      setDesc('');
      setHashtags('');
      setIsPrivate(false);
      alert('¡Publicado exitosamente!');
    }, 1800);
  };

  const pickLiveMobileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLiveMobileImage(result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    if (tab === 'publicacion') {
      setTimeout(() => setShowPublish(true), 200);
    } else {
      setShowPublish(false);
    }
  }, [tab]);

  return (
    <View style={styles.container}>
      {/* Menú superior SOLO para la pestaña LIVE */}
      {tab === 'live' && (
        <>
          {/* Header TikTok LIVE Studio */}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              marginBottom: vScale(8),
              marginTop: vScale(2),
              position: 'absolute',
              top: vScale(10),
              left: 0,
              right: 0,
              zIndex: 201,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: '#fff' }}>Android</Text>
              <View
                style={{
                  backgroundColor: '#ff2d55',
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  marginLeft: 4,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scale(12) }}>LIVE Studio</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.liveMobileMenuTop,
              {
                position: 'absolute',
                top: vScale(48), // debajo del header
                left: 0,
                right: 0,
                zIndex: 200,
                marginBottom: 0,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.liveMobileMenuBtn, liveMobileTab === 'opciones' && styles.liveMobileMenuBtnActive]}
              onPress={() => setLiveMobileTab('opciones')}
            >
              <Text style={[styles.liveMobileMenuText, liveMobileTab === 'opciones' && styles.liveMobileMenuTextActive]}>
                Opciones para dispositivos móviles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.liveMobileMenuBtn, liveMobileTab === 'live' && styles.liveMobileMenuBtnActive]}
              onPress={() => setLiveMobileTab('live')}
            >
              <Text style={[styles.liveMobileMenuText, liveMobileTab === 'live' && styles.liveMobileMenuTextActive]}>
                Live Studio
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Contenido según la pestaña */}
      {tab === 'publicacion' ? (
        <>
          <Text style={styles.title}>Sube tu video o imagen</Text>
          <Text style={styles.subtitle}>Comparte tu creatividad con la comunidad</Text>

          {/* Portada y botón "+" */}
          <View style={styles.pubPortadaRow}>
            {media ? (
              <Animated.View entering={FadeIn.duration(400)} style={styles.pubPortadaBox}>
                <Image source={{ uri: media.uri }} style={styles.pubPortadaImg} resizeMode="cover" />
                <TouchableOpacity style={styles.pubRemovePortadaBtn} onPress={() => setMedia(null)}>
                  <Text style={styles.pubRemovePortadaText}>×</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity style={styles.pubAddPortadaBox} onPress={pickMedia}>
                <Animated.Text entering={FadeIn.duration(400)} style={styles.pubAddPortadaPlus}>+</Animated.Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Título */}
          <TextInput
            style={styles.pubTituloInput}
            placeholder="Agrega un título llamativo"
            placeholderTextColor="#bbb"
            value={desc}
            onChangeText={setDesc}
            maxLength={80}
          />
          {/* Descripción */}
          <Text style={styles.pubDescSugerencia}>
            Una descripción larga permite obtener 3 veces más visitas en promedio.
          </Text>
          {/* Chips de hashtag y mención */}
          <View style={styles.pubChipsRow}>
            <TouchableOpacity style={styles.pubChip}><Text style={styles.pubChipText}># Hashtags</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pubChip}><Text style={styles.pubChipText}>@ Mención</Text></TouchableOpacity>
          </View>
          {/* Opciones de publicación */}
          <View style={styles.pubOptionRow}>
            <TouchableOpacity style={styles.pubOptionBtn}>
              <Text style={styles.pubOptionIcon}>＋</Text>
              <Text style={styles.pubOptionText}>Agregar enlace</Text>
              <View style={styles.pubOptionDot} />
              <Text style={styles.pubOptionArrow}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pubOptionRow}>
            <TouchableOpacity style={styles.pubOptionBtn}>
              <Text style={styles.pubOptionIcon}>🌐</Text>
              <Text style={styles.pubOptionText}>Todo el mundo puede ver esta publicación</Text>
              <Text style={styles.pubOptionArrow}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pubOptionRow}>
            <TouchableOpacity style={styles.pubOptionBtn}>
              <Text style={styles.pubOptionIcon}>⋯</Text>
              <View style={{flex: 1}}>
                <Text style={styles.pubOptionText}>Más opciones</Text>
                <Text style={styles.pubOptionSubText}>Los ajustes de privacidad y otros ajustes se trasladaron aquí.</Text>
              </View>
              <Text style={styles.pubOptionArrow}>›</Text>
            </TouchableOpacity>
          </View>
          {/* Compartir en */}
          <View style={styles.pubCompartirRow}>
            <Text style={styles.pubCompartirText}>Compartir en</Text>
            <View style={styles.pubCompartirIcons}>
              <TouchableOpacity style={styles.pubCompartirIconBtn}>
                <Text style={styles.pubCompartirIcon}>🌐</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pubCompartirIconBtn}>
                <Text style={styles.pubCompartirIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Botones inferiores */}
          <View style={styles.pubBottomRow}>
            <TouchableOpacity style={styles.pubDraftBtn}>
              <Text style={styles.pubDraftBtnText}> Borradores</Text>
            </TouchableOpacity>
            {showPublish && (
              <Animated.View entering={FadeIn.duration(500)}>
                <TouchableOpacity
                  style={[
                    styles.pubPublishBtn,
                    uploading && { backgroundColor: '#aaa' }
                  ]}
                  onPress={handlePublish}
                  disabled={uploading}
                >
                  <Text style={styles.pubPublishBtnText}>{uploading ? 'Publicando...' : ' Publicar'}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      ) : (
        <View style={styles.liveTabBox}>
          {/* Contenido de Opciones para dispositivos móviles */}
          {liveMobileTab === 'opciones' ? (
            <>
              {/* Lo que ya estaba en la pestaña Live */}
              {/* Header y título */}
              <View style={styles.liveHeaderRow}>
                <View style={styles.liveHeaderIconBox}>
                  <Text style={{fontSize: 28}}>🖼️</Text>
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: scale(13), marginBottom: 2}}>Aquí puedes poner imágenes</Text>
                  <TextInput
                    style={styles.liveTitleInput}
                    placeholder="Agrega un título ✏️"
                    placeholderTextColor="#ccc"
                    maxLength={60}
                  />
                  <Text style={styles.liveDetailsLabel}>Detalles</Text>
                </View>
              </View>
              {/* Temas y objetivo */}
              <View style={styles.liveTagsRow}>
                <TouchableOpacity style={styles.liveTagBtn}><Text style={styles.liveTagText}># Agregar un tema</Text></TouchableOpacity>
                <TouchableOpacity style={styles.liveTagBtn}><Text style={styles.liveTagText}>🎯 Agregar un objetivo</Text></TouchableOpacity>
              </View>
              {/* Recompensas y aviso */}
              <View style={styles.liveRewardBox}>
                <Text style={styles.liveRewardTitle}>Recompensas LIVE escalonadas</Text>
                <Text style={styles.liveRewardDesc}>¡Consigue Diamantes de los Regalos o de los comentarios destacados!</Text>
              </View>
              <View style={styles.liveStudioBox}>
                <Text style={styles.liveStudioLabel}><Text style={styles.liveStudioRed}>LIVE Studio</Text> ya está disponible</Text>
              </View>
              {/* Nueva opción: Activar Tienda */}
              <View style={styles.pubOptionRow}>
                <TouchableOpacity
                  style={styles.pubOptionBtn}
                  onPress={() => setTiendaActiva((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.pubOptionIcon}>🛒</Text>
                  <Text style={styles.pubOptionText}>Activar Tienda</Text>
                  {/* Palomita si está activa */}
                  {tiendaActiva && (
                    <Text style={{ fontSize: scale(18), color: '#4faaff', marginRight: scale(8) }}>✔️</Text>
                  )}
                  <Text style={styles.pubOptionArrow}>›</Text>
                </TouchableOpacity>
              </View>
              {/* Acciones tipo grid */}
              <View style={styles.liveActionsGrid}>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="💡" label="Consejos" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="⚙️" label="Ajustes" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="🔗" label="Compartir" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="👥" label="Equipo" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="❓" label="Adivina" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="🧭" label="Orientación" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="🏠" label="Centro" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="📊" label="Encuesta" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="💖" label="Fans" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="✨" label="Más" dot />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="🎁" label="Promo" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="🔴" label="Transmitir" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="📱" label="Compartir con otro dispositivo" />
                </View>
                <View style={styles.liveActionsRowVertical}>
                  <LiveAction icon="➕" label="Agregar" />
                </View>
              </View>
              {/* Botón principal */}
              <TouchableOpacity style={styles.liveMainBtn}>
                <Text style={styles.liveMainBtnText}>Emitir LIVE</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Nuevo contenido para la pestaña Live Studio (igual a la imagen)
            <View style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingHorizontal: scale(10),
              paddingTop: vScale(10),
            }}>
              {/* Encabezado TikTok LIVE Studio */}
              <View style={{width: '100%', alignItems: 'center', marginBottom: vScale(10)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Text style={{fontSize: scale(20), fontWeight: 'bold', color: '#fff'}}>Android</Text>
                  <View style={{backgroundColor: '#ff2d55', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 4}}>
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: scale(12)}}>LIVE Studio</Text>
                  </View>
                </View>
              </View>
              {/* Imagen de preview de transmisión */}
              <View style={{
                width: scale(220),
                height: scale(110),
                backgroundColor: '#181818',
                borderRadius: scale(10),
                marginBottom: vScale(12),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#222',
              }}>
                {/* Simulación de pantalla negra y botón rojo */}
                <View style={{
                  width: '85%',
                  height: '70%',
                  backgroundColor: '#000',
                  borderRadius: scale(4),
                  marginBottom: scale(7),
                  alignItems: 'center',
                  justifyContent: 'center',
                }} />
                <View style={{
                  width: scale(18),
                  height: scale(7),
                  backgroundColor: '#ff2d55',
                  borderRadius: scale(2),
                  alignSelf: 'flex-end',
                  marginRight: scale(10),
                }} />
              </View>
              {/* Texto descriptivo */}
              <Text style={{
                color: '#fff',
                fontSize: scale(13),
                textAlign: 'center',
                marginBottom: vScale(2),
              }}>
                Crea contenido fácilmente y comparte momentos{'\n'}
                mágicos con el software de transmisión{'\n'}
                diseñado específicamente para la experiencia de{'\n'}
                Android LIVE.
              </Text>
              <Text style={{
                color: '#aaa',
                fontSize: scale(11.5),
                textAlign: 'center',
                marginBottom: vScale(8),
                marginTop: vScale(2),
              }}>
                Nota: Las claves de transmisión son solo para{'\n'}
                determinadas cuentas verificadas. Usa LIVE Studio{'\n'}
                en su lugar.
              </Text>
              {/* Botón "Más información" */}
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginBottom: vScale(6),
              }}>
                <Text style={{color: '#4faaff', fontWeight: 'bold', fontSize: scale(13)}}>Más información</Text>
              </TouchableOpacity>
              {/* Botón "Obtener enlace de descarga" */}
              <TouchableOpacity style={{
                backgroundColor: '#232323',
                borderRadius: scale(8),
                paddingVertical: vScale(8),
                paddingHorizontal: scale(18),
                marginBottom: vScale(14),
                alignSelf: 'stretch',
                alignItems: 'center',
              }}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: scale(14)}}>Obtener enlace de descarga</Text>
              </TouchableOpacity>
              {/* Acciones Transmitir y Compartir */}
              <View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around',
                marginBottom: vScale(18),
              }}>
                <View style={{alignItems: 'center'}}>
                  <View style={{
                    width: scale(38),
                    height: scale(38),
                    borderRadius: scale(8),
                    backgroundColor: '#232323',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}>
                    <Text style={{fontSize: scale(18), color: '#fff'}}>📺</Text>
                  </View>
                  <Text style={{color: '#fff', fontSize: scale(12)}}>Transmitir</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <View style={{
                    width: scale(38),
                    height: scale(38),
                    borderRadius: scale(8),
                    backgroundColor: '#232323',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}>
                    <Text style={{fontSize: scale(18), color: '#fff'}}>🖥️</Text>
                  </View>
                  <Text style={{color: '#fff', fontSize: scale(12)}}>Compartir c...</Text>
                </View>
              </View>
              {/* Botón principal "Supervisar videos LIVE" */}
              <TouchableOpacity style={{
                backgroundColor: '#ff2d55',
                borderRadius: scale(22),
                paddingHorizontal: scale(40),
                paddingVertical: vScale(12),
                marginBottom: vScale(10),
                alignSelf: 'center',
                shadowColor: '#ff2d55',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <Text style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: scale(16),
                  letterSpacing: 1,
                }}>Supervisar videos LIVE</Text>
              </TouchableOpacity>
              {/* Etiqueta LIVE Studio y publicación */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: vScale(8),
                marginBottom: vScale(2),
              }}>
                <Text style={{
                  color: '#fff',
                  fontSize: scale(13),
                  marginRight: scale(8),
                }}>LIVE Studio</Text>
                <Text style={{
                  color: '#aaa',
                  fontSize: scale(13),
                  marginRight: scale(4),
                }}></Text>
                <Text style={{
                  color: '#ff2d55',
                  fontSize: scale(13),
                  fontWeight: 'bold',
                }}></Text>
              </View>
            </View>
          )}
        </View>
      )}
      {/* Menú inferior */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuBtn, tab === 'publicacion' && styles.menuBtnActive]}
          onPress={() => setTab('publicacion')}
        >
          <Text style={[styles.menuBtnText, tab === 'publicacion' && styles.menuBtnTextActive]}>Publicación</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuBtn, tab === 'live' && styles.menuBtnActive]}
          onPress={() => setTab('live')}
        >
          <Text style={[styles.menuBtnText, tab === 'live' && styles.menuBtnTextActive]}>Live</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(18),
    paddingTop: vScale(30),
    paddingBottom: vScale(30),
  },
  title: {
    color: 'white',
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: vScale(8),
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: scale(13.5),
    marginBottom: vScale(14),
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: scale(18),
    paddingVertical: vScale(10),
    borderRadius: scale(10),
    marginBottom: vScale(16),
  },
  uploadBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(15),
  },
  previewBox: {
    width: Math.min(SCREEN_WIDTH * 0.7, 270),
    height: Math.max(SCREEN_HEIGHT * 0.36, 180),
    borderRadius: scale(16),
    backgroundColor: '#222',
    marginBottom: vScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#333',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
    borderRadius: scale(16),
  },
  videoPreviewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    backgroundColor: '#ff6b6b',
    borderRadius: scale(7),
    paddingHorizontal: scale(8),
    paddingVertical: vScale(2.5),
    zIndex: 10,
  },
  removeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(11),
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: Platform.OS === 'ios' ? vScale(10) : vScale(7),
    fontSize: scale(14),
    marginBottom: vScale(8),
    borderWidth: 1,
    borderColor: '#333',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vScale(12),
    gap: 8,
  },
  privacyLabel: {
    color: '#fff',
    fontSize: scale(13),
    marginHorizontal: 4,
  },
  publishBtn: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: scale(30),
    paddingVertical: vScale(10),
    borderRadius: scale(13),
    marginTop: vScale(7),
    marginBottom: vScale(7),
  },
  publishBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(15.5),
    letterSpacing: 1,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: scale(13),
    marginTop: vScale(6),
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'center', // centra los botones horizontalmente
    alignItems: 'center',
    backgroundColor: '#181818',
    paddingVertical: vScale(10),
    borderTopWidth: 1,
    borderColor: '#222',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  menuBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vScale(4),
  },
  menuBtnActive: {
    borderBottomWidth: 3,
    borderColor: '#ff6b6b',
  },
  menuBtnText: {
    color: '#aaa',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  menuBtnTextActive: {
    color: '#ff6b6b',
  },
  // liveMobileMenuTop solo debe estar definido una vez
  liveTabBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: vScale(100), // deja espacio para el menú superior y header
    paddingBottom: vScale(70),
  },
  liveMobileOptionsBox: {
    width: '100%',
    marginBottom: vScale(18),
    paddingHorizontal: scale(8),
  },
  liveMobileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: vScale(12),
    gap: scale(12),
  },
  liveMobileHeaderIconBox: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(10),
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
    overflow: 'hidden',
  },
  liveMobileHeaderImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    resizeMode: 'cover',
  },
  liveMobileHeaderImagePlaceholder: {
    width: '100%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  liveMobileHeaderDetails: {
    color: '#fff',
    fontSize: scale(11),
    backgroundColor: '#232323',
    width: '100%',
    textAlign: 'center',
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    paddingVertical: 2,
    marginTop: 2,
  },
  liveMobileHeaderTitleInput: {
    flex: 1,
    backgroundColor: '#232323',
    color: '#fff',
    borderRadius: scale(7),
    paddingHorizontal: scale(12),
    paddingVertical: vScale(10),
    fontSize: scale(18),
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#333',
  },
  liveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: vScale(7),
    paddingHorizontal: scale(6),
  },
  liveHeaderIconBox: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(4),
  },
  liveTitleInput: {
    backgroundColor: '#232323',
    color: '#fff',
    borderRadius: scale(7),
    paddingHorizontal: scale(8),
    paddingVertical: vScale(6),
    fontSize: scale(15),
    fontWeight: 'bold',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  liveDetailsLabel: {
    color: '#aaa',
    fontSize: scale(11.5),
    marginLeft: 2,
  },
  liveTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: vScale(7),
    width: '100%',
    paddingHorizontal: scale(6),
  },
  liveTagBtn: {
    backgroundColor: '#232323',
    borderRadius: scale(13),
    paddingHorizontal: scale(10),
    paddingVertical: vScale(5),
    marginRight: scale(5),
  },
  liveTagText: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: scale(13),
  },
  liveRewardBox: {
    backgroundColor: '#232323',
    borderRadius: scale(10),
    padding: scale(8),
    marginBottom: vScale(6),
    width: '95%',
    alignSelf: 'center',
  },
  liveRewardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(13.5),
    marginBottom: 2,
  },
  liveRewardDesc: {
    color: '#aaa',
    fontSize: scale(11.5),
  },
  liveStudioBox: {
    backgroundColor: '#232323',
    borderRadius: scale(10),
    padding: scale(7),
    marginBottom: vScale(7),
    width: '95%',
    alignSelf: 'center',
  },
  liveStudioLabel: {
    color: '#fff',
    fontSize: scale(12),
  },
  liveStudioRed: {
    color: '#ff2d55',
    fontWeight: 'bold',
    fontSize: scale(12),
  },
  liveActionsGrid: {
    marginTop: vScale(7),
    marginBottom: vScale(12),
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(10),
  },
  liveActionsRowVertical: {
    width: '22%',
    alignItems: 'center',
    marginVertical: vScale(8),
    minWidth: scale(70),
    flexGrow: 1,
  },
  liveActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(5),
    position: 'relative',
  },
  liveActionIcon: {
    color: '#fff',
    marginBottom: 1,
  },
  liveActionLabel: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 1,
    opacity: 0.85,
    includeFontPadding: false,
    padding: 0,
    lineHeight: scale(12),
  },
  liveActionDot: {
    position: 'absolute',
    top: scale(2.5),
    right: scale(7),
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    backgroundColor: '#ff2d55',
    borderWidth: 1,
    borderColor: '#fff',
  },
  liveMainBtn: {
    backgroundColor: '#ff2d55',
    borderRadius: scale(22),
    paddingHorizontal: scale(40),
    paddingVertical: vScale(10),
    marginTop: vScale(10),
    marginBottom: vScale(7),
    alignSelf: 'center',
    shadowColor: '#ff2d55',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  liveMainBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
    letterSpacing: 1,
  },
  liveMobileMenuTop: {
    flexDirection: 'row',
    justifyContent: 'space-around', // igual que el menú inferior
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: scale(13),
    width: '100%', // ocupa todo el ancho
    paddingVertical: vScale(7),
    gap: scale(10),
    position: 'absolute',
    top: vScale(48),
    left: 0,
    right: 0,
    zIndex: 200,
  },
  liveMobileMenuBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vScale(4),
  },
  liveMobileMenuBtnActive: {
    borderBottomWidth: 3,
    borderColor: '#ff6b6b',
  },
  liveMobileMenuText: {
    color: '#aaa',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  liveMobileMenuTextActive: {
    color: '#ff6b6b',
  },
  pubPortadaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vScale(10),
    marginTop: vScale(5),
    width: '100%',
    gap: scale(10),
  },
  pubPortadaBox: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(10),
    overflow: 'hidden',
    backgroundColor: '#232323',
    marginRight: scale(8),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  pubPortadaImg: {
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
  },
  pubRemovePortadaBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#232323',
    borderRadius: scale(10),
    width: scale(22),
    height: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: scale(1),
    borderColor: '#444',
  },
  pubRemovePortadaText: {
    fontSize: scale(18),
    lineHeight: scale(20),
    color: '#ff2d55',
    fontWeight: 'bold',
  },
  pubAddPortadaBox: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(10),
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1.5),
    borderColor: '#444',
    marginRight: scale(8),
  },
  pubAddPortadaPlus: {
    fontSize: scale(36),
    color: '#bbb',
    fontWeight: 'bold',
  },
  pubTituloInput: {
    width: '100%',
    fontSize: scale(17),
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: vScale(10),
    marginBottom: vScale(2),
    borderWidth: scale(1),
    borderColor: '#333',
    color: '#fff',
    backgroundColor: '#232323',
  },
  pubDescSugerencia: {
    fontSize: scale(13),
    marginBottom: vScale(8),
    marginLeft: scale(2),
    color: '#aaa',
  },
  pubChipsRow: {
    gap: scale(8),
    marginBottom: vScale(10),
    width: '100%',
    flexDirection: 'row',
  },
  pubChip: {
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: vScale(5),
    marginRight: scale(4),
    borderWidth: scale(1),
    borderColor: '#333',
    backgroundColor: '#181818',
  },
  pubChipText: {
    fontSize: scale(13),
    color: '#fff',
    fontWeight: 'bold',
  },
  pubOptionRow: {
    borderBottomWidth: scale(1),
    borderColor: '#232323',
    backgroundColor: '#181818',
    width: '100%',
  },
  pubOptionBtn: {
    paddingVertical: vScale(12),
    paddingHorizontal: scale(8),
    minHeight: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pubOptionIcon: {
    fontSize: scale(18),
    marginRight: scale(10),
    width: scale(24),
    textAlign: 'center',
    color: '#fff',
  },
  pubOptionText: {
    fontSize: scale(15),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  pubOptionSubText: {
    fontSize: scale(12),
    marginTop: scale(2),
    color: '#aaa',
    fontWeight: '400',
  },
  pubOptionArrow: {
    fontSize: scale(22),
    marginLeft: scale(6),
    color: '#bbb',
  },
  pubOptionDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
    marginLeft: scale(2),
    marginRight: scale(2),
    backgroundColor: '#ff2d55',
  },
  pubCompartirRow: {
    marginTop: vScale(10),
    marginBottom: vScale(10),
    paddingHorizontal: scale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  pubCompartirText: {
    fontSize: scale(15),
    fontWeight: 'bold',
    color: '#fff',
  },
  pubCompartirIcons: {
    gap: scale(8),
    flexDirection: 'row',
  },
  pubCompartirIconBtn: {
    borderRadius: scale(20),
    width: scale(36),
    height: scale(36),
    marginLeft: scale(4),
    borderWidth: scale(1),
    borderColor: '#333',
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pubCompartirIcon: {
    fontSize: scale(20),
    color: '#fff',
  },
  pubBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // centra los botones horizontalmente
    width: '100%',
    marginTop: vScale(18),
    marginBottom: vScale(2),
    gap: 0,
  },
  pubDraftBtn: {
    borderRadius: scale(10),
    paddingVertical: vScale(12),
    marginRight: scale(8),
    borderWidth: scale(1),
    borderColor: '#333',
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pubDraftBtnText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  pubPublishBtn: {
    borderRadius: scale(10),
    paddingVertical: vScale(12),
    marginLeft: scale(8),
    elevation: 2,
    backgroundColor: '#ff2d55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pubPublishBtnText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
});
