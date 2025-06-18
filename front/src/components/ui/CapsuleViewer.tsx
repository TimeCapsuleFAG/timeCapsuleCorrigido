import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
  Alert 
} from "react-native";
import { ArrowLeft, Calendar, Clock, Lock, Unlock, Image as ImageIcon, Music as AudioIcon } from "react-native-feather";
import LinearGradient from "react-native-linear-gradient";
import { Audio } from "expo-av"; // Para reprodução de áudio
import { TimeCapsule } from "@/types/TimeCapsule"; // Importar o tipo TimeCapsule

interface CapsuleViewerProps {
  capsule: TimeCapsule;
  onBack: () => void;
  onOpenCapsule: (id: string) => void;
}

const CapsuleViewer = ({ capsule, onBack, onOpenCapsule }: CapsuleViewerProps) => {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canOpenCapsule = () => {
    const openDate = new Date(capsule.openDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return openDate <= today;
  };

  const handleOpenCapsule = () => {
    if (canOpenCapsule()) {
      onOpenCapsule(capsule.id);
      Alert.alert(
        "🎉 Cápsula Aberta!",
        "Bem-vindo à sua memória do passado!",
        [{ text: "OK" }]
      );
    }
  };

  const playAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else if (capsule.audioUrl) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: capsule.audioUrl }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível reproduzir o áudio");
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const daysUntilOpen = Math.ceil(
    (new Date(capsule.openDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <LinearGradient
      colors={['#f3e8ff', '#e0f2fe', '#e0e7ff']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={onBack}
              style={styles.backButton}
            >
              <ArrowLeft width={16} height={16} color="#000" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Visualizar Cápsula</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <View style={styles.titleRow}>
                  {capsule.isOpened ? (
                    <Unlock width={24} height={24} color="#059669" style={styles.titleIcon} />
                  ) : (
                    <Lock width={24} height={24} color="#6b7280" style={styles.titleIcon} />
                  )}
                  <Text style={styles.cardTitle}>{capsule.title}</Text>
                </View>
                <View style={styles.mediaIcons}>
                  {capsule.imageUrl && (
                    <ImageIcon width={20} height={20} color="#9333ea" />
                  )}
                  {capsule.audioUrl && (
                    <AudioIcon width={20} height={20} color="#9333ea" style={{marginLeft: 8}} />
                  )}
                </View>
              </View>
            </View>

            <View style={styles.cardContent}>
              {/* Status e Datas */}
              <View style={styles.dateSection}>
                <View style={styles.dateRow}>
                  <View style={styles.dateItem}>
                    <Calendar width={16} height={16} color="#4b5563" />
                    <View style={styles.dateTextContainer}>
                      <Text style={styles.dateLabel}>Criada em</Text>
                      <Text style={styles.dateValue}>{formatDate(capsule.createdDate)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateItem}>
                    <Clock width={16} height={16} color="#4b5563" />
                    <View style={styles.dateTextContainer}>
                      <Text style={styles.dateLabel}>Data de abertura</Text>
                      <Text style={styles.dateValue}>{formatDate(capsule.openDate)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Status da Cápsula */}
              {!capsule.isOpened && (
                <View style={styles.statusSection}>
                  {canOpenCapsule() ? (
                    <View style={styles.readyToOpenContainer}>
                      <Text style={styles.readyToOpenText}>
                        🎉 Sua cápsula está pronta para ser aberta!
                      </Text>
                      <TouchableOpacity 
                        onPress={handleOpenCapsule}
                        style={styles.openButton}
                      >
                        <Unlock width={20} height={20} color="#fff" style={{marginRight: 8}} />
                        <Text style={styles.openButtonText}>Abrir Cápsula</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.lockedContainer}>
                      <Text style={styles.lockedText}>
                        🔒 Esta cápsula ainda está selada
                      </Text>
                      <Text style={styles.daysRemainingText}>
                        Faltam {daysUntilOpen} dia(s) para a abertura
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Conteúdo da Cápsula (apenas se estiver aberta) */}
              {capsule.isOpened && (
                <View style={styles.contentSection}>
                  <View style={styles.openedBanner}>
                    <Text style={styles.openedBannerText}>
                      ✅ Cápsula aberta em {formatDate(new Date().toISOString())}
                    </Text>
                  </View>

                  <View style={styles.messageSection}>
                    <Text style={styles.sectionTitle}>Sua Mensagem:</Text>
                    <View style={styles.messageContainer}>
                      <Text style={styles.messageText}>
                        {capsule.message}
                      </Text>
                    </View>
                  </View>

                  {/* Imagem */}
                  {capsule.imageUrl && (
                    <View style={styles.imageSection}>
                      <View style={styles.sectionTitleContainer}>
                        <ImageIcon width={20} height={20} color="#374151" />
                        <Text style={styles.sectionTitle}>Imagem da Cápsula:</Text>
                      </View>
                      <View style={styles.imageContainer}>
                        <Image 
                          source={{ uri: capsule.imageUrl }}
                          style={styles.capsuleImage}
                          resizeMode="cover"
                        />
                      </View>
                    </View>
                  )}

                  {/* Áudio */}
                  {capsule.audioUrl && (
                    <View style={styles.audioSection}>
                      <View style={styles.sectionTitleContainer}>
                        <AudioIcon width={20} height={20} color="#374151" />
                        <Text style={styles.sectionTitle}>Áudio da Cápsula:</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={playAudio}
                        style={styles.audioButton}
                      >
                        <Text style={styles.audioButtonText}>
                          {isPlaying ? "⏸️ Pausar" : "▶️ Reproduzir"} Áudio
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    paddingTop: 50, // Para compensar a status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  dateSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  dateRow: {
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTextContainer: {
    marginLeft: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  dateValue: {
    fontWeight: '500',
    marginTop: 2,
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  readyToOpenContainer: {
    alignItems: 'center',
  },
  readyToOpenText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lockedContainer: {
    alignItems: 'center',
  },
  lockedText: {
    color: '#4b5563',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  daysRemainingText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  contentSection: {
    gap: 24,
  },
  openedBanner: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  openedBannerText: {
    color: '#15803d',
    fontWeight: '500',
  },
  messageSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageContainer: {
    backgroundColor: '#faf5ff',
    borderLeftWidth: 4,
    borderLeftColor: '#a855f7',
    padding: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  messageText: {
    color: '#374151',
    lineHeight: 24,
  },
  imageSection: {
    marginTop: 24,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  capsuleImage: {
    width: '100%',
    height: 300,
  },
  audioSection: {
    marginTop: 24,
  },
  audioButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CapsuleViewer;