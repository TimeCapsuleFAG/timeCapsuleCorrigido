"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Appearance } from "react-native"

export interface Theme {
  isDark: boolean
  colors: {
    primary: string
    primaryDark: string
    secondary: string
    background: string
    surface: string
    card: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    shadow: string
  }
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: "#7c3aed",
    primaryDark: "#5b21b6",
    secondary: "#06b6d4",
    background: "#f3e8ff",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
}

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: "#8b5cf6",
    primaryDark: "#7c3aed",
    secondary: "#06b6d4",
    background: "#0f0f23",
    surface: "#1f1f3a",
    card: "#2d2d5a",
    text: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "#374151",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
}

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark")
      } else {
        // Use system theme as default
        const systemTheme = Appearance.getColorScheme()
        setIsDark(systemTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
      // Fallback to light theme
      setIsDark(false)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTheme = async (theme: string) => {
    try {
      await AsyncStorage.setItem("theme", theme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    saveTheme(newTheme ? "dark" : "light")
  }

  const setTheme = (dark: boolean) => {
    setIsDark(dark)
    saveTheme(dark ? "dark" : "light")
  }

  const theme = isDark ? darkTheme : lightTheme

  // Don't render children until theme is loaded
  if (isLoading) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}
