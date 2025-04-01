import { useAuthStore } from '@/stores/authStore';
import { useRoute, useRouter } from 'nuxt/app';

export function useUsers() {

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.API_CONFIG_URL + '/config-players';

    const getUsers = async () => {
        const token = authStore.token; // Obtiene el token del store
    
        if (!token) {
            console.error("No hay token disponible");
            throw new Error("Token no disponible");
        }
    
        try {
            return await $fetch(`${BASE_URL}/players`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token a los headers
                }
            });
        } catch (error) {
            console.error("Error al obtener los enemigos:", error);
            throw error;
        }
    };

    const createUser = async (user) => {
        const token = authStore.token; // Obtiene el token del store
    
        if (!token) {
            console.error("No hay token disponible");
            throw new Error("Token no disponible");
        }
        
        try {
            return await $fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token a los headers
                },
                body: JSON.stringify(user)
            });
        } catch (error) {
            console.error("Error al actualizar el enemigo:", error);
            throw error;
        }
    };

    const updateUser = async (id, user) => {
        const token = authStore.token; // Obtiene el token del store
    
        if (!token) {
            console.error("No hay token disponible");
            throw new Error("Token no disponible");
        }

        try {
            return await $fetch(`${BASE_URL}/players/${id}/stats`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token a los headers
                },
                body: JSON.stringify(user)
            });
        } catch (error) {
            console.error("Error al actualizar el enemigo:", error);
            throw error;
        }
    };

    const deleteUser = async (user) => {
        const token = authStore.token; // Obtiene el token del store
    
        if (!token) {
            console.error("No hay token disponible");
            throw new Error("Token no disponible");
        }
        
        try {
            return await $fetch(`${BASE_URL}/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token a los headers
                },
                body: JSON.stringify(user)
            });
        } catch (error) {
            console.error("Error al actualizar el enemigo:", error);
            throw error;
        }
    }

    return {
        getUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}