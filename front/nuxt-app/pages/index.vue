<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-800">Bienvenido a nuestra plataforma</h1>
            <p class="mt-4 text-gray-600">Únete a nosotros y disfruta de una experiencia increíble.</p>
            <div v-if="!authStore.isAuthenticated" class="mt-6 space-x-4">
                <nuxt-link to="/auth/login"
                    class="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Iniciar sesión</nuxt-link>
                <nuxt-link to="/auth/register"
                    class="px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600">Registrarse</nuxt-link>
            </div>
            <div v-else class="mt-6 space-x-4">
                <nuxt-link to="/dashboard"
                    class="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Entrar</nuxt-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

console.log('isAuthenticated', authStore.isAuthenticated);

</script>