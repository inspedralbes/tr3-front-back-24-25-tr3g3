<template>
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-96">
      <h1 class="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">Iniciar Sessió</h1>
  
      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correu Electrònic</label>
          <input type="email" id="email" v-model="email" required
            class="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
  
        <!-- Password Input -->
        <div class="mb-0">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contrasenya</label>
          <input type="password" id="password" v-model="password" required
            class="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
  
        <!-- Forgot Password Link -->
        <div class="text-right">
          <NuxtLink to="/auth/forgot-password" class="text-blue-500 text-sm hover:underline">Has oblidat la teva contrasenya?</NuxtLink>
        </div>
  
        <!-- Submit Button -->
        <button type="submit"
          class="cursor-pointer w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="isLoading">
          <span v-if="!isLoading">Iniciar Sessió</span>
          <div v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Carregant...</span>
          </div>
        </button>
      </form>
  
      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="border-t border-gray-300 flex-grow"></div>
        <span class="mx-4 text-sm text-gray-500 dark:text-gray-400">O</span>
        <div class="border-t border-gray-300 flex-grow"></div>
      </div>
  
      <!-- Google Login -->
      <button @click="handleGoogleLogin"
        class="cursor-pointer flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full"
        :disabled="isLoadingGoogle">
        <span v-if="!isLoadingGoogle">Continuar amb Google</span>
        <div v-else class="flex items-center">
          <svg class="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <span>Carregant...</span>
        </div>
      </button>
  
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">No tens compte?
          <NuxtLink to="/auth/register" class="text-blue-500 hover:underline">Registra't</NuxtLink>
        </p>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from "@/services/useAuth";

const { login, loginGoogle } = useAuth();

const isLoading = ref(false);
const isLoadingGoogle = ref(false);
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await login(email.value, password.value);
    window.location.href = response.redirectUrl;
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  isLoadingGoogle.value = true;
  loginGoogle();
};
</script>
