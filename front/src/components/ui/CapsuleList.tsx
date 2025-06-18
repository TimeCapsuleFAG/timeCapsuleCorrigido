"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { ThemedCard, ThemedButton, ThemedText, ThemedTextInput } from "./ThemedComponents"
import { FadeInView, SlideInView } from "./AnimatedComponents"
import { LoadingSpinner } from "./LoadingSpinner"
import type { TimeCapsule } from "../../types/TimeCapsule"
import { capsuleService } from "../../services/api"

const CapsuleList = () => {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])
  const [filteredCapsules, setFilteredCapsules] = useState<TimeCapsule[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("todas")
  const [apiError, setApiError] = useState<string | null>(null)

  const { theme, isDark } = useTheme()
  const navigation = useNavigation()

  const filters = [
    { id: "todas", label: "Todas", count: capsules.length },
    { id: "abertas", label: "Abertas", count: capsules.filter((c) => c.isOpened).length },
    { id: "fechadas", label: "Fechadas", count: capsules.filter((c) => !c.isOpened).length },
    {
      id: "disponiveis",
      label: "Disponíveis",
      count: capsules.filter((c) => !c.isOpened && new Date(c.openDate) <= new Date()).length,
    },
  ]

  useFocusEffect(
    useCallback(() => {
      loadCapsules()
    }, []),
  )

  useEffect(() => {
    filterCapsules()
  }, [capsules, searchQuery, selectedFilter])

  const loadCapsules = async () => {
    try {
      setLoading(true)
      setApiError(null)

      const data = await capsuleService.getAllCapsules()
      setCapsules(data)
    } catch (error) {
      console.error("Erro ao carregar cápsulas:", error)
      setApiError("Não foi possível carregar as cápsulas do servidor.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filterCapsules = () => {
    let filtered = [...capsules]

    // Filtrar por busca
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (capsule) =>
          capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          capsule.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filtrar por categoria
    switch (selectedFilter) {
      case "abertas":
        filtered = filtered.filter((c) => c.isOpened)
        break
      case "fechadas":
        filtered = filtered.filter((c) => !c.isOpened)
        break
      case "disponiveis":
        filtered = filtered.filter((c) => !c.isOpened && new Date(c.openDate) <= new Date())
        break
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())

    setFilteredCapsules(filtered)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadCapsules()
  }

  const handleOpenCapsule = async (capsule: TimeCapsule) => {
    if (capsule.isOpened) {
      Alert.alert("Cápsula Aberta", `Título: ${capsule.title}\n\nMensagem: ${capsule.message}`)
      return
    }

    const canOpen = new Date(capsule.openDate) <= new Date()
    if (!canOpen) {
      const daysLeft = Math.ceil((new Date(capsule.openDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      Alert.alert(
        "Cápsula Bloqueada 🔒",
        `Esta cápsula só pode ser aberta em ${new Date(capsule.openDate).toLocaleDateString()}.\n\nFaltam ${daysLeft} dias!`,
      )
      return
    }

    Alert.alert("Abrir Cápsula", "Tem certeza que deseja abrir esta cápsula? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Abrir",
        onPress: async () => {
          try {
            // Abrir cápsula via API
            const updatedCapsule = await capsuleService.openCapsule(capsule.id)

            // Atualizar lista local
            setCapsules((prevCapsules) => prevCapsules.map((c) => (c.id === capsule.id ? { ...c, isOpened: true } : c)))

            // Mostrar conteúdo
            Alert.alert("🎉 Cápsula Aberta!", `Título: ${capsule.title}\n\nMensagem: ${capsule.message}`)
          } catch (error) {
            console.error("Erro ao abrir cápsula:", error)
            Alert.alert("Erro", "Não foi possível abrir a cápsula.")
          }
        },
      },
    ])
  }

  const handleDeleteCapsule = (capsule: TimeCapsule) => {
    Alert.alert("Excluir Cápsula", "Tem certeza que deseja excluir esta cápsula? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            // Excluir via API
            await capsuleService.deleteCapsule(capsule.id)

            // Atualizar lista local
            setCapsules((prevCapsules) => prevCapsules.filter((c) => c.id !== capsule.id))

            Alert.alert("Sucesso", "Cápsula excluída com sucesso.")
          } catch (error) {
            console.error("Erro ao excluir cápsula:", error)
            Alert.alert("Erro", "Não foi possível excluir a cápsula.")
          }
        },
      },
    ])
  }

  const getCapsuleStatus = (capsule: TimeCapsule) => {
    if (capsule.isOpened) return { text: "Aberta", color: theme.colors.success, icon: "🔓" }
    if (new Date(capsule.openDate) <= new Date()) return { text: "Disponível", color: theme.colors.warning, icon: "⏰" }
    return { text: "Bloqueada", color: theme.colors.textSecondary, icon: "🔒" }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getDaysUntilOpen = (openDate: string) => {
    const days = Math.ceil((new Date(openDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner size="large" />
        <ThemedText style={{ marginTop: 16 }}>Carregando suas cápsulas...</ThemedText>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <View style={styles.content}>
        {/* Header */}
        <FadeInView style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ThemedText variant="title">←</ThemedText>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <ThemedText variant="title" style={styles.title}>
                📦 Minhas Cápsulas
              </ThemedText>
              <ThemedText variant="body" color="textSecondary">
                {capsules.length} cápsula{capsules.length !== 1 ? "s" : ""} criada{capsules.length !== 1 ? "s" : ""}
              </ThemedText>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </FadeInView>

        {/* API Error */}
        {apiError && (
          <FadeInView style={styles.apiError}>
            <ThemedText variant="body" color="primary" style={{ color: theme.colors.error }}>
              ⚠️ {apiError}
            </ThemedText>
            <ThemedButton
              title="Tentar Novamente"
              onPress={loadCapsules}
              variant="outline"
              size="small"
              style={{ marginTop: 8 }}
            />
          </FadeInView>
        )}

        {/* Search */}
        <SlideInView direction="up" delay={200}>
          <ThemedTextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar cápsulas..."
            style={styles.searchInput}
          />
        </SlideInView>

        {/* Filters */}
        <SlideInView direction="up" delay={300}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedFilter === filter.id ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <ThemedText
                  variant="caption"
                  style={{
                    color: selectedFilter === filter.id ? "#fff" : theme.colors.text,
                    fontWeight: selectedFilter === filter.id ? "600" : "normal",
                  }}
                >
                  {filter.label} ({filter.count})
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SlideInView>

        {/* Capsules List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {filteredCapsules.length === 0 ? (
            <SlideInView direction="up" delay={400}>
              <ThemedCard style={styles.emptyCard}>
                <ThemedText variant="subtitle" style={styles.emptyTitle}>
                  {searchQuery ? "Nenhuma cápsula encontrada" : "Nenhuma cápsula ainda"}
                </ThemedText>
                <ThemedText variant="body" color="textSecondary" style={styles.emptyText}>
                  {searchQuery
                    ? "Tente buscar por outros termos"
                    : "Crie sua primeira cápsula do tempo e guarde memórias especiais para o futuro!"}
                </ThemedText>
                {!searchQuery && (
                  <ThemedButton
                    title="✨ Criar Primeira Cápsula"
                    onPress={() => navigation.navigate("CreateCapsule" as never)}
                    variant="primary"
                    style={styles.createFirstButton}
                  />
                )}
              </ThemedCard>
            </SlideInView>
          ) : (
            filteredCapsules.map((capsule, index) => {
              const status = getCapsuleStatus(capsule)
              const daysLeft = getDaysUntilOpen(capsule.openDate)

              return (
                <SlideInView key={capsule.id} direction="up" delay={400 + index * 100}>
                  <ThemedCard style={styles.capsuleCard}>
                    <TouchableOpacity onPress={() => handleOpenCapsule(capsule)}>
                      <View style={styles.capsuleHeader}>
                        <View style={styles.capsuleInfo}>
                          <ThemedText variant="subtitle" style={styles.capsuleTitle}>
                            {capsule.title}
                          </ThemedText>
                          <View style={styles.capsuleStatus}>
                            <ThemedText variant="caption" style={{ color: status.color }}>
                              {status.icon} {status.text}
                            </ThemedText>
                            {!capsule.isOpened && daysLeft > 0 && (
                              <ThemedText variant="caption" color="textSecondary">
                                • {daysLeft} dia{daysLeft !== 1 ? "s" : ""} restante{daysLeft !== 1 ? "s" : ""}
                              </ThemedText>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteCapsule(capsule)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <ThemedText style={{ color: theme.colors.error }}>🗑️</ThemedText>
                        </TouchableOpacity>
                      </View>

                      <ThemedText variant="body" color="textSecondary" numberOfLines={2} style={styles.capsuleMessage}>
                        {capsule.message}
                      </ThemedText>

                      <View style={styles.capsuleDates}>
                        <ThemedText variant="caption" color="textSecondary">
                          Criada em {formatDate(capsule.createdDate)}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                          Abre em {formatDate(capsule.openDate)}
                        </ThemedText>
                      </View>

                      {(capsule.imageUrl || capsule.audioUrl) && (
                        <View style={styles.mediaIndicators}>
                          {capsule.imageUrl && (
                            <ThemedText variant="caption" color="primary">
                              📸 Foto
                            </ThemedText>
                          )}
                          {capsule.audioUrl && (
                            <ThemedText variant="caption" color="primary">
                              🎵 Áudio
                            </ThemedText>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  </ThemedCard>
                </SlideInView>
              )
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
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
    marginBottom: 4,
  },
  apiError: {
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  searchInput: {
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  createFirstButton: {
    marginTop: 8,
  },
  capsuleCard: {
    marginBottom: 12,
  },
  capsuleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  capsuleInfo: {
    flex: 1,
  },
  capsuleTitle: {
    marginBottom: 4,
  },
  capsuleStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  capsuleMessage: {
    marginBottom: 12,
    lineHeight: 20,
  },
  capsuleDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mediaIndicators: {
    flexDirection: "row",
    gap: 12,
  },
})

export default CapsuleList
