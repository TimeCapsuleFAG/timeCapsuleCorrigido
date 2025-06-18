"use client"

import type React from "react"
import { View, Text, TouchableOpacity, TextInput, type ViewStyle, type TextStyle, StyleSheet } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { AnimatedButton } from "./AnimatedComponents"

interface ThemedCardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
}

export const ThemedCard: React.FC<ThemedCardProps> = ({ children, style, elevated = true }) => {
  const { theme } = useTheme()

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
    elevated && {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    style,
  ]

  return <View style={cardStyle}>{children}</View>
}

interface ThemedButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  animated?: boolean
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
  animated = true,
}) => {
  const { theme } = useTheme()

  const getButtonStyle = () => {
    let sizeStyle
    switch (size) {
      case "small":
        sizeStyle = styles.buttonSmall
        break
      case "medium":
        sizeStyle = styles.buttonMedium
        break
      case "large":
        sizeStyle = styles.buttonLarge
        break
      default:
        sizeStyle = styles.buttonMedium
    }

    const baseStyle = {
      ...styles.button,
      ...sizeStyle,
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        }
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        }
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: theme.colors.primary,
        }
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        }
      default:
        return baseStyle
    }
  }

  const getTextStyle = () => {
    let sizeTextStyle
    switch (size) {
      case "small":
        sizeTextStyle = styles.buttonTextSmall
        break
      case "medium":
        sizeTextStyle = styles.buttonTextMedium
        break
      case "large":
        sizeTextStyle = styles.buttonTextLarge
        break
      default:
        sizeTextStyle = styles.buttonTextMedium
    }

    const baseTextStyle = {
      ...styles.buttonText,
      ...sizeTextStyle,
    }

    switch (variant) {
      case "primary":
      case "secondary":
        return {
          ...baseTextStyle,
          color: "#ffffff",
        }
      case "outline":
      case "ghost":
        return {
          ...baseTextStyle,
          color: theme.colors.primary,
        }
      default:
        return baseTextStyle
    }
  }

  const buttonContent = (
    <View style={[getButtonStyle(), style, disabled && { opacity: 0.6 }]}>
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </View>
  )

  if (animated) {
    return (
      <AnimatedButton onPress={onPress} disabled={disabled}>
        {buttonContent}
      </AnimatedButton>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      {buttonContent}
    </TouchableOpacity>
  )
}

interface ThemedTextInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
  style?: ViewStyle
  textStyle?: TextStyle
  secureTextEntry?: boolean
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  style,
  textStyle,
  secureTextEntry = false,
}) => {
  const { theme } = useTheme()

  return (
    <TextInput
      style={[
        styles.textInput,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          color: theme.colors.text,
        },
        multiline && { height: numberOfLines * 40 + 20 },
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      textAlignVertical={multiline ? "top" : "center"}
    />
  )
}

interface ThemedTextProps {
  children: React.ReactNode
  variant?: "title" | "subtitle" | "body" | "caption"
  color?: "primary" | "secondary" | "text" | "textSecondary"
  style?: TextStyle
  numberOfLines?: number
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = "body",
  color = "text",
  style,
  numberOfLines,
}) => {
  const { theme } = useTheme()

  const getTextStyle = () => {
    let variantStyle
    switch (variant) {
      case "title":
        variantStyle = styles.textTitle
        break
      case "subtitle":
        variantStyle = styles.textSubtitle
        break
      case "body":
        variantStyle = styles.textBody
        break
      case "caption":
        variantStyle = styles.textCaption
        break
      default:
        variantStyle = styles.textBody
    }

    const colorStyle = { color: theme.colors[color] }

    return [variantStyle, colorStyle, style]
  }

  return (
    <Text style={getTextStyle()} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontWeight: "600",
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextMedium: {
    fontSize: 16,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  textSubtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  textBody: {
    fontSize: 16,
  },
  textCaption: {
    fontSize: 14,
  },
})
