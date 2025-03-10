
const API_BASE_URL = "http://localhost:3000";

export async function login(credentials) {
    try {
        return await $fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: credentials
        })
    } catch (error) {
        console.error('Error en login:', error)
        throw error
    }
}

export async function loginGoogle() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
}

export async function logout() {
    try {
        return await $fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' })
    } catch (error) {
        console.error('Error en logout:', error)
        throw error
    }
}
