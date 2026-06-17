import { create } from 'zustand'

const useStore = create((set) => ({
  // User state
  user: null,
  token: localStorage.getItem('token') || null,

  // Documents
  documents: [],

  // Chat
  messages: [],
  isLoading: false,

  // Actions
  setUser: (user) => set({ user }),

  login: (userData, token) => {
    localStorage.setItem('token', token)
    set({ user: userData, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, messages: [], documents: [] })
  },

  setDocuments: (documents) => set({ documents }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setLoading: (isLoading) => set({ isLoading }),

  clearMessages: () => set({ messages: [] })
}))

export default useStore