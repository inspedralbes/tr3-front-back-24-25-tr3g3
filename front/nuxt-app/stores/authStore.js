// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),
    actions: {
        setUser(user) {
            this.user = user
        },
        setToken(token) {
            this.token = token
        },
        setIsAuthenticated(value) {
            this.isAuthenticated = value
        },
    }
})
