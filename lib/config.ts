// Configuration de l'API backend
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bnp-paribas-ce6m.onrender.com'

// Fonction helper pour les appels API
export const fetchAPI = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`
  return fetch(url, options)
}

