"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, SafeAreaView, StatusBar, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { TimeCapsule } from "../types/TimeCapsule"
import { useTheme } from "../contexts/ThemeContext"
import { ThemedCard, ThemedButton, ThemedText } from "../components/ui/ThemedComponents"
import { FadeInView, SlideInView, PulseView } from "../components/ui/AnimatedComponents"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { capsuleService } from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Index = () => {
  const navigation = useNavigation()
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])
  const [loading, setLoading] = useState(true)
  const [isApiConnected, setIsApiConnected] = useState(true)
  const { theme, isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCapsules()
    })

    return unsubscribe
  }, [navigation])

  // Função para checar conexão com a API
  const checkApiConnection = async (): Promise<boolean> => {
    try {
      // Tenta buscar uma cápsula como teste de conexão
      await capsuleService.getAllCapsules()
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    // Verificar conexão com a API
    const checkConnection = async () => {
      const isConnected = await checkApiConnection()
      setIsApiConnected(isConnected)

      if (!isConnected) {
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique se o backend está rodando.", [
          { text: "OK" },
        ])
      }
    }

    checkConnection()
  }, [])

  const loadCapsules = async () => {
    try {
      setLoading(true)

      if (!isApiConnected) {
        // Fallback para dados locais se a API não estiver disponível
        const savedCapsules = await AsyncStorage.getItem("timeCapsules")
        if (savedCapsules) {
          setCapsules(JSON.parse(savedCapsules))
        }
        return
      }

      // Buscar da API
      const data = await capsuleService.getAllCapsules()
      setCapsules(data)
    } catch (error) {
      console.error("Erro ao carregar cápsulas:", error)
      Alert.alert("Erro", "Não foi possível carregar as cápsulas. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCapsule = () => {
    navigation.navigate("CreateCapsule" as never)
  }

  const handleViewCapsules = () => {
    navigation.navigate("CapsuleList" as never)
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner size="large" />
        <ThemedText style={{ marginTop: 16 }}>Carregando suas cápsulas...</ThemedText>
      </View>
    )
  }

  const availableCapsules = capsules.filter((c) => !c.isOpened && new Date(c.openDate) <= new Date()).length
  const openedCapsules = capsules.filter((c) => c.isOpened).length

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* API Status Indicator */}
          {!isApiConnected && (
            <FadeInView style={styles.apiWarning}>
              <ThemedText variant="caption" color="primary">
                ⚠️ Modo offline: Servidor não conectado
              </ThemedText>
            </FadeInView>
          )}

          {/* Theme Toggle */}
          <FadeInView style={styles.themeToggle}>
            <View style={styles.themeToggleContainer}>
              <ThemedText variant="caption" color="textSecondary">
                {isDark ? "🌙" : "☀️"} {isDark ? "Modo Escuro" : "Modo Claro"}
              </ThemedText>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={isDark ? theme.colors.surface : theme.colors.surface}
              />
            </View>
          </FadeInView>

          {/* Header */}
          <FadeInView delay={200} style={styles.header}>
            <PulseView duration={3000}>
              <ThemedText variant="title" style={styles.title}>
                ⏰ TimeCapsule
              </ThemedText>
            </PulseView>
            <SlideInView direction="up" delay={400}>
              <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
                Guarde suas memórias e mensagens para o futuro. Crie cápsulas do tempo digitais que só podem ser abertas
                na data que você escolher.
              </ThemedText>
            </SlideInView>
          </FadeInView>

          {/* Stats Card */}
          <SlideInView direction="up" delay={600}>
            <ThemedCard style={styles.statsCard}>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <ThemedText variant="title" color="primary">
                    {capsules.length}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Cápsulas Criadas
                  </ThemedText>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statItem}>
                  <ThemedText variant="title" color="secondary">
                    {openedCapsules}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Já Abertas
                  </ThemedText>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statItem}>
                  <ThemedText variant="title" style={{ color: theme.colors.warning }}>
                    {availableCapsules}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Disponíveis
                  </ThemedText>
                </View>
              </View>
            </ThemedCard>
          </SlideInView>

          {/* Action Buttons */}
          <SlideInView direction="up" delay={800} style={styles.actionButtons}>
            <ThemedButton
              title="✨ Criar Nova Cápsula"
              onPress={handleCreateCapsule}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />

            <ThemedButton
              title={`📦 Ver Minhas Cápsulas (${capsules.length})`}
              onPress={handleViewCapsules}
              variant="outline"
              size="large"
              style={styles.secondaryButton}
            />
          </SlideInView>

          {/* Quick Actions */}
          <SlideInView direction="up" delay={1000}>
            <ThemedCard style={styles.quickActionsCard}>
              <ThemedText variant="subtitle" style={styles.quickActionsTitle}>
                Ações Rápidas
              </ThemedText>

              <View style={styles.quickActionsGrid}>
                <ThemedButton
                  title="📝 Nota Rápida"
                  onPress={handleCreateCapsule}
                  variant="ghost"
                  size="small"
                  style={styles.quickActionButton}
                />

                <ThemedButton
                  title="📸 Foto Memória"
                  onPress={handleCreateCapsule}
                  variant="ghost"
                  size="small"
                  style={styles.quickActionButton}
                />

                <ThemedButton
                  title="🎵 Áudio Pessoal"
                  onPress={handleCreateCapsule}
                  variant="ghost"
                  size="small"
                  style={styles.quickActionButton}
                />

                <ThemedButton
                  title="🎁 Surpresa Futura"
                  onPress={handleCreateCapsule}
                  variant="ghost"
                  size="small"
                  style={styles.quickActionButton}
                />
              </View>
            </ThemedCard>
          </SlideInView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  apiWarning: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 4,
  },
  themeToggle: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  themeToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.5,
  },
  actionButtons: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  quickActionsCard: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minWidth: "45%",
  },
})

export default Index
