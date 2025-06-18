// Função simples para gerar IDs únicos sem dependência externa
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
