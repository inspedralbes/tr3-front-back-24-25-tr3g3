import { useAuthStore } from '@/stores/authStore';
import { useRoute, useRouter } from 'nuxt/app';

export function useConfigEnemies() {

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.API_CONFIG_URL + '/config-enemies';

    const getEnemies = async () => {
        const token = authStore.token; // Obtiene el token del store
    
        if (!token) {
            console.error("No hay token disponible");
            throw new Error("Token no disponible");
        }
    
        try {
            return await $fetch(`${BASE_URL}/enemies`, {
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

    return {
        getEnemies,
    };
}