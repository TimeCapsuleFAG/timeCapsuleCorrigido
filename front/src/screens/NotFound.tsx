import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const NotFound = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const attemptedRoute = (route.params as any)?.attemptedRoute || 'unknown';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      attemptedRoute
    );
  }, [attemptedRoute]);

  const handleGoHome = () => {
    navigation.navigate('Index' as never);
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Index' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.title}>Oops! Página não encontrada</Text>
        <Text style={styles.description}>
          A página que você está procurando não existe ou foi movida.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotFound;