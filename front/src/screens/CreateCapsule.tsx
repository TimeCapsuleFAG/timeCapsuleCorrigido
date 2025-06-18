"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../contexts/ThemeContext"
import { ThemedCard, ThemedButton, ThemedText, ThemedTextInput } from "../components/ui/ThemedComponents"
import { FadeInView, SlideInView } from "../components/ui/AnimatedComponents"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { capsuleService } from "../services/api"
import * as ImagePicker from 'expo-image-picker';

function CreateCapsule() {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [openDate, setOpenDate] = useState("")
  const [category, setCategory] = useState("pessoal")
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { id: "pessoal", label: "📝 Pessoal", color: theme.colors.primary },
    { id: "familia", label: "👨‍👩‍👧‍👦 Família", color: theme.colors.secondary },
    { id: "trabalho", label: "💼 Trabalho", color: theme.colors.warning },
    { id: "viagem", label: "✈️ Viagem", color: theme.colors.success },
    { id: "meta", label: "🎯 Meta", color: theme.colors.error },
  ]

  const quickDates = [
    { label: "1 mês", days: 30 },
    { label: "6 meses", days: 180 },
    { label: "1 ano", days: 365 },
    { label: "5 anos", days: 1825 },
  ]

  const handleQuickDate = (days: number) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    setOpenDate(futureDate.toISOString().split("T")[0])
  }

  const handleSelectImage = async () => {
    // Solicita permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É preciso permitir acesso à galeria para escolher uma imagem.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    })
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleCreateCapsule = async () => {
    if (!title.trim() || !message.trim() || !openDate.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Validar data
    const selectedDate = new Date(openDate)
    const today = new Date()

    if (selectedDate <= today) {
      Alert.alert("Erro", "A data de abertura deve ser no futuro.")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('titulo', title.trim())
      formData.append('conteudo', message.trim())
      formData.append('dataAbertura', selectedDate.toISOString())
      formData.append('categoria', category)
      if (selectedImage) {
        formData.append('files', {
          uri: selectedImage,
          name: 'imagem.jpg',
          type: 'image/jpeg',
        } as any)
      }

      // Enviar para a API
      await capsuleService.createCapsule(formData, true)

      Alert.alert(
        "Sucesso! 🎉",
        `Sua cápsula "${title}" foi criada e será aberta em ${new Date(openDate).toLocaleDateString("pt-BR")}.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    } catch (error) {
      console.error("Erro ao criar cápsula:", error)
      Alert.alert("Erro", "Não foi possível criar a cápsula. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <FadeInView style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ThemedText variant="title">←</ThemedText>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <ThemedText variant="title" style={styles.title}>
                  ✨ Criar Nova Cápsula
                </ThemedText>
                <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
                  Crie uma mensagem para o seu futuro
                </ThemedText>
              </View>
              <View style={styles.headerSpacer} />
            </View>
          </FadeInView>

          {/* Form */}
          <SlideInView direction="up" delay={200}>
            <ThemedCard style={styles.formCard}>
              {/* Título */}
              <View style={styles.inputGroup}>
                <ThemedText variant="subtitle" style={styles.label}>
                  Título da Cápsula *
                </ThemedText>
                <ThemedTextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ex: Carta para mim em 2025"
                  style={styles.input} />
              </View>

              {/* Categoria */}
              <View style={styles.inputGroup}>
                <ThemedText variant="subtitle" style={styles.label}>
                  Categoria
                </ThemedText>
                <View style={styles.categoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: category === cat.id ? cat.color : theme.colors.surface,
                          borderColor: cat.color,
                          borderWidth: category === cat.id ? 2 : 1,
                        },
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <ThemedText
                        variant="caption"
                        style={{
                          color: category === cat.id ? "#fff" : cat.color,
                          fontWeight: category === cat.id ? "600" : "normal",
                        }}
                      >
                        {cat.label} {category === cat.id ? "✔️" : ""}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Mensagem */}
              <View style={styles.inputGroup}>
                <ThemedText variant="subtitle" style={styles.label}>
                  Sua Mensagem *
                </ThemedText>
                <ThemedTextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Escreva sua mensagem para o futuro..."
                  multiline
                  numberOfLines={6}
                  style={styles.textArea} />
              </View>

              {/* Data de Abertura */}
              <View style={styles.inputGroup}>
                <ThemedText variant="subtitle" style={styles.label}>
                  Data de Abertura *
                </ThemedText>
                <ThemedTextInput
                  value={openDate}
                  onChangeText={setOpenDate}
                  placeholder="YYYY-MM-DD (Ex: 2025-12-31)"
                  style={styles.input} />

                {/* Datas Rápidas */}
                <View style={styles.quickDatesContainer}>
                  <ThemedText variant="caption" color="textSecondary" style={styles.quickDatesLabel}>
                    Datas rápidas:
                  </ThemedText>
                  <View style={styles.quickDatesGrid}>
                    {quickDates.map((date) => (
                      <TouchableOpacity
                        key={date.label}
                        style={[styles.quickDateButton, { borderColor: theme.colors.primary }]}
                        onPress={() => handleQuickDate(date.days)}
                      >
                        <ThemedText variant="caption" color="primary">
                          {date.label}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <ThemedText variant="caption" color="textSecondary" style={styles.hint}>
                  Use o formato YYYY-MM-DD. A cápsula só poderá ser aberta nesta data.
                </ThemedText>
              </View>

              {/* Imagem */}
              <View style={styles.inputGroup}>
                <ThemedText variant="subtitle" style={styles.label}>
                  Adicionar Imagem (Opcional)
                </ThemedText>

                {selectedImage ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(undefined)}>
                      <ThemedText style={{ color: "#fff" }}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.imagePickerButton, { borderColor: theme.colors.border }]}
                    onPress={handleSelectImage}
                  >
                    <ThemedText variant="body" color="textSecondary">
                      📸 Tocar para adicionar uma foto
                    </ThemedText>
                  </TouchableOpacity>
                )}
                <ThemedText variant="caption" color="textSecondary" style={styles.hint}>
                  Imagem será enviada junto com a cápsula. Formatos aceitos: JPG, PNG.
                </ThemedText>
              </View>
            </ThemedCard>
          </SlideInView>

          {/* Buttons */}
          <SlideInView direction="up" delay={400} style={styles.buttonContainer}>
            <ThemedButton
              title={isLoading ? "Criando..." : "🚀 Criar Cápsula"}
              onPress={handleCreateCapsule}
              variant="primary"
              size="large"
              disabled={isLoading}
              style={styles.createButton} />

            <ThemedButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
              disabled={isLoading} />
          </SlideInView>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingSpinner size="large" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  formCard: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  hint: {
    marginTop: 4,
    fontStyle: "italic",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickDatesContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  quickDatesLabel: {
    marginBottom: 8,
  },
  quickDatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickDateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
  },
  createButton: {
    marginBottom: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default CreateCapsule
