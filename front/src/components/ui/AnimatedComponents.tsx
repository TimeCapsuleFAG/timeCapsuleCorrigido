"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Animated, TouchableOpacity, type ViewStyle, Easing } from "react-native"

interface FadeInViewProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  style?: ViewStyle
}

export const FadeInView: React.FC<FadeInViewProps> = ({ children, duration = 800, delay = 0, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start()
    }, delay)

    return () => clearTimeout(timer)
  }, [fadeAnim, duration, delay])

  return <Animated.View style={[{ opacity: fadeAnim }, style]}>{children}</Animated.View>
}

interface SlideInViewProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  duration?: number
  delay?: number
  distance?: number
  style?: ViewStyle
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = "up",
  duration = 600,
  delay = 0,
  distance = 50,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.8,
          useNativeDriver: true,
        }),
      ]).start()
    }, delay)

    return () => clearTimeout(timer)
  }, [slideAnim, opacityAnim, duration, delay, distance])

  const getTransform = () => {
    switch (direction) {
      case "left":
        return [{ translateX: slideAnim }]
      case "right":
        return [{ translateX: Animated.multiply(slideAnim, -1) }]
      case "up":
        return [{ translateY: slideAnim }]
      case "down":
        return [{ translateY: Animated.multiply(slideAnim, -1) }]
      default:
        return [{ translateY: slideAnim }]
    }
  }

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

interface AnimatedButtonProps {
  children: React.ReactNode
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, onPress, style, disabled = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
          },
          style,
          disabled && { opacity: 0.6 },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  )
}

interface PulseViewProps {
  children: React.ReactNode
  duration?: number
  style?: ViewStyle
}

export const PulseView: React.FC<PulseViewProps> = ({ children, duration = 2000, style }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse())
    }

    pulse()
  }, [pulseAnim, duration])

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}
