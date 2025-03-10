import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        isLoading: false,
        notification: null,
    }),
    actions: {
        setLoading(value) {
            this.isLoading = value
        },
        setNotification(message) {
            this.notification = message
            setTimeout(() => (this.notification = null), 3000)
        },
    }
});
