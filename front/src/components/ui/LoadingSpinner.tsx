"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Animated, StyleSheet } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  color?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium", color }) => {
  const { theme } = useTheme()
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0)
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin())
    }
    spin()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const getSize = () => {
    switch (size) {
      case "small":
        return 20
      case "medium":
        return 30
      case "large":
        return 40
      default:
        return 30
    }
  }

  const spinnerSize = getSize()
  const spinnerColor = color || theme.colors.primary

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: `${spinnerColor}20`,
            borderTopColor: spinnerColor,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 50,
  },
})
