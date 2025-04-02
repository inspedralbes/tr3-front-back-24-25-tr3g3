import { useAuthStore } from '@/stores/authStore';
import { useRoute, useRouter } from 'nuxt/app';

export function useAuth() {

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.API_AUTH_URL + '/auth';

    const login = async (email, password) => {
        try {
            return await $fetch(`${BASE_URL}/login`, {
                method: "POST",
                body: { email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error;
        }
    };

    const loginGoogle = () => {
        window.location.href = `${BASE_URL}/google`;
    };

    const processUserFromQuery = () => {
        const userParam = route.query.user
        const tokenParam = route.query.token
        
        if (!userParam) {
            router.push("/auth/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userParam);
            authStore.setUser(parsedUser);
            authStore.setToken(tokenParam);
            authStore.setIsAuthenticated(true);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error al analizar los datos del usuario:", error);
            router.push("/auth/login");
        }
    };

    const forgotPassword = async (email) => {
        try {
            console.log("Enviando solicitud de restablecimiento de contraseña...");
            return await $fetch(`${BASE_URL}/send-password-reset-email`, {
                method: "POST",
                body: { email },
            });
        } catch (error) {
            console.error("Error en el restablecimiento de contraseña:", error);
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        if (!token) throw new Error("Token no proporcionado");
        if (newPassword.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

        try {
            console.log("Enviando solicitud de restablecimiento de contraseña...");
            return await $fetch(`${BASE_URL}/reset-password/${token}`, {
                method: "POST",
                body: { newPassword },
            });
        } catch (error) {
            console.error("Error en el restablecimiento de contraseña:", error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            console.log("Enviando solicitud de registro...");
            return await $fetch(`${BASE_URL}/unity/register`, {
                method: "POST",
                body: { username, email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el registro:", error);
            throw error;
        }
    };

    const verifyEmailToken = async (token) => {
        if (!token) throw new Error("Token not provided");

        try {
            const response = await $fetch(`${BASE_URL}/verify-email/${token}`, {
                method: "POST",
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    return { login, loginGoogle, forgotPassword, processUserFromQuery, register, verifyEmailToken, resetPassword };
}