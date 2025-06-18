"use client"

import { useState } from "react"
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../contexts/ThemeContext"
import { ThemedCard, ThemedButton, ThemedText, ThemedTextInput } from "../components/ui/ThemedComponents"
import { FadeInView, SlideInView, PulseView } from "../components/ui/AnimatedComponents"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { authService } from "../services/api"

const Login = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validação de senha
  const isValidPassword = (password: string) => {
    return password.length >= 6
  }

  const handleLogin = async () => {
    // Validações
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu email.")
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, digite um email válido.")
      return
    }

    if (!password.trim()) {
      Alert.alert("Erro", "Por favor, digite sua senha.")
      return
    }

    if (!isValidPassword(password)) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      // Chamada real à API de login
      await authService.login(email.trim(), password)
      Alert.alert("Sucesso! 🎉", "Login realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Index" as never),
        },
      ])
    } catch (error: any) {
      console.error("Erro no login:", error)
      Alert.alert("Erro", error?.response?.data?.message || "Credenciais inválidas. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    Alert.alert("Recuperar Senha", "Funcionalidade de recuperação de senha será implementada em breve!", [
      { text: "OK" },
    ])
  }

  const handleSignUp = () => {
    Alert.alert("Criar Conta", "Funcionalidade de cadastro será implementada em breve!", [{ text: "OK" }])
  }

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`Login com ${provider}`, `Funcionalidade de login com ${provider} será implementada em breve!`, [
      { text: "OK" },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Header */}
            <FadeInView style={styles.header}>
              <PulseView duration={3000}>
                <ThemedText variant="title" style={styles.logo}>
                  ⏰ TimeCapsule
                </ThemedText>
              </PulseView>
              <SlideInView direction="up" delay={300}>
                <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
                  Entre na sua conta para acessar suas cápsulas do tempo
                </ThemedText>
              </SlideInView>
            </FadeInView>

            {/* Login Form */}
            <SlideInView direction="up" delay={500}>
              <ThemedCard style={styles.loginCard}>
                <ThemedText variant="subtitle" style={styles.formTitle}>
                  Fazer Login
                </ThemedText>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <ThemedText variant="body" style={styles.label}>
                    Email
                  </ThemedText>
                  <ThemedTextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    style={
                      Object.assign(
                        {},
                        styles.input,
                        !isValidEmail(email) && email.length > 0 ? { borderColor: theme.colors.error } : {}
                      )
                    }
                  />
                  {!isValidEmail(email) && email.length > 0 && (
                    <ThemedText variant="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
                      Email inválido
                    </ThemedText>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <ThemedText variant="body" style={styles.label}>
                    Senha
                  </ThemedText>
                  <View style={styles.passwordContainer}>
                    <ThemedTextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Sua senha"
                      style={
                        Object.assign(
                          {},
                          styles.passwordInput,
                          !isValidPassword(password) && password.length > 0 ? { borderColor: theme.colors.error } : {}
                        )
                      }
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                      <ThemedText variant="body" color="primary">
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  {!isValidPassword(password) && password.length > 0 && (
                    <ThemedText variant="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
                      A senha deve ter pelo menos 6 caracteres
                    </ThemedText>
                  )}
                </View>

                {/* Remember Me & Forgot Password */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: theme.colors.border },
                        rememberMe && { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      {rememberMe && (
                        <ThemedText variant="caption" style={{ color: "#fff" }}>
                          ✓
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText variant="caption" color="textSecondary" style={styles.rememberMeText}>
                      Lembrar de mim
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleForgotPassword}>
                    <ThemedText variant="caption" color="primary">
                      Esqueci minha senha
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <ThemedButton
                  title={isLoading ? "Entrando..." : "🚀 Entrar"}
                  onPress={handleLogin}
                  variant="primary"
                  size="large"
                  disabled={isLoading || !isValidEmail(email) || !isValidPassword(password)}
                  style={styles.loginButton}
                />

                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <LoadingSpinner size="small" />
                  </View>
                )}
              </ThemedCard>
            </SlideInView>

            {/* Social Login */}
            <SlideInView direction="up" delay={700}>
              <View style={styles.socialLoginContainer}>
                <View style={styles.dividerContainer}>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  <ThemedText variant="caption" color="textSecondary" style={styles.dividerText}>
                    ou continue com
                  </ThemedText>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity
                    style={[styles.socialButton, { borderColor: theme.colors.border }]}
                    onPress={() => handleSocialLogin("Google")}
                  >
                    <ThemedText variant="body">🔍 Google</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.socialButton, { borderColor: theme.colors.border }]}
                    onPress={() => handleSocialLogin("Apple")}
                  >
                    <ThemedText variant="body">🍎 Apple</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </SlideInView>

            {/* Sign Up Link */}
            <SlideInView direction="up" delay={900}>
              <View style={styles.signUpContainer}>
                <ThemedText variant="body" color="textSecondary">
                  Não tem uma conta?{" "}
                </ThemedText>
                <TouchableOpacity onPress={handleSignUp}>
                  <ThemedText variant="body" color="primary" style={styles.signUpLink}>
                    Criar conta
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </SlideInView>

            {/* Skip Login (for demo) */}
            <SlideInView direction="up" delay={1100}>
              <TouchableOpacity style={styles.skipContainer} onPress={() => navigation.navigate("Index" as never)}>
                <ThemedText variant="caption" color="textSecondary">
                  Pular login (Demo)
                </ThemedText>
              </TouchableOpacity>
            </SlideInView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  loginCard: {
    marginBottom: 24,
  },
  formTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 12,
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  rememberMeText: {
    marginLeft: 4,
  },
  loginButton: {
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  socialLoginContainer: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpLink: {
    fontWeight: "600",
  },
  skipContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
})

export default Login
