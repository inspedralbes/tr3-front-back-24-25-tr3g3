import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { useRoute, useRouter } from 'nuxt/app';

export function useAuth() {
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.API_BASE_URL;

    const login = async (credentials) => {
        try {
            return await $fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                body: credentials,
            });
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error;
        }
    };

    const loginGoogle = () => {
        window.location.href = `${BASE_URL}/api/auth/google`;
    };

    const processUserFromQuery = () => {
        const userData = route.query.user;

        if (!userData) {
            router.push("/auth/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            authStore.setUser(parsedUser);
            authStore.setIsAuthenticated(true);
            router.push("/");
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

    const logout = async () => {
        try {
            return await $fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
        } catch (error) {
            console.error("Error en el cierre de sesión:", error);
            throw error;
        }
    };

    return { login, loginGoogle, processUserFromQuery, forgotPassword, resetPassword, verifyEmailToken, logout };
}