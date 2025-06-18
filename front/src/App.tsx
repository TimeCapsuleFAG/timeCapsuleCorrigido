import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext"

// Screens
import Index from "./screens/Index"
import NotFound from "./screens/NotFound"
import CreateCapsule from "./screens/CreateCapsule"
import CapsuleList from "./components/ui/CapsuleList"
import Login from "./screens/Login"

// Types
export type RootStackParamList = {
  Login: undefined
  Index: undefined
  CreateCapsule: undefined
  CapsuleList: undefined
  NotFound: { attemptedRoute?: string }
}

const Stack = createStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="CreateCapsule" component={CreateCapsule} />
        <Stack.Screen name="CapsuleList" component={CapsuleList} />
        <Stack.Screen
          name="NotFound"
          component={NotFound}
          options={{
            title: "Página não encontrada",
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
          <Toast />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App
