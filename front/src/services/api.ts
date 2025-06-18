import axios from "axios"
import type { TimeCapsule } from "../types/TimeCapsule"
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base do axios
const api = axios.create({
  baseURL: "http://192.168.1.3:3000", // Altere conforme necessário
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token JWT enviado:', token); // LOG para depuração
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Serviço de cápsulas
export const capsuleService = {
  // Listar todas as cápsulas
  async getAllCapsules(): Promise<TimeCapsule[]> {
    try {
      const response = await api.get("/capsule")
      const capsules = response.data.data || [];
      // Mapeamento dos campos do backend para o front-end
      return capsules.map((capsule: any) => ({
        id: capsule.id,
        title: capsule.titulo,
        message: capsule.conteudo,
        openDate: capsule.dataAbertura,
        createdDate: capsule.createdAt || capsule.dataCriacao || capsule.dataAbertura, // fallback
        isOpened: capsule.status === 'aberta',
        imageUrl: capsule.imagem ? `${api.defaults.baseURL}/uploads/${capsule.imagem}` : undefined,
        audioUrl: capsule.audio ? `${api.defaults.baseURL}/uploads/${capsule.audio}` : undefined,
        category: capsule.categoria,
      }))
    } catch (error) {
      console.error("Erro ao buscar cápsulas:", error)
      throw error
    }
  },

  // Buscar cápsula por ID
  async getCapsuleById(id: string): Promise<TimeCapsule> {
    try {
      const response = await api.get(`/capsule/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar cápsula ${id}:`, error)
      throw error
    }
  },

  // Criar nova cápsula
  async createCapsule(capsule: any, p0: boolean): Promise<TimeCapsule> {
    try {
      const response = await api.post("/capsule", capsule, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar cápsula:", error);
      throw error;
    }
  },

  // Abrir cápsula
  async openCapsule(id: string): Promise<TimeCapsule> {
    try {
      const response = await api.patch(`/capsule/${id}/open`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao abrir cápsula ${id}:`, error)
      throw error
    }
  },

  // Excluir cápsula
  async deleteCapsule(id: string): Promise<void> {
    try {
      await api.delete(`/capsule/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir cápsula ${id}:`, error)
      throw error
    }
  },
}

// Serviço de autenticação
export const authService = {
  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await api.post("/auth/login", { email, password })
      // Salva o token JWT no AsyncStorage
      if (response.data && response.data.access_token) {
        await AsyncStorage.setItem('token', response.data.access_token);
      }
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default api
