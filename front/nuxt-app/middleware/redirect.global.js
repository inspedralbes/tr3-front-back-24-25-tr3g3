import { useAuthStore } from '@/stores/authStore';
import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();  // Asegúrate de acceder al store aquí

  const isAutenticated = null;

  // Si el usuario no está autenticado
  if (!isAutenticated) {
    // Permite acceso a las rutas /auth/ y la página de inicio
    if (to.path === '/' || to.path.startsWith('/auth/')) {
      return;
    }
    // Redirige a login si intenta acceder a cualquier otra ruta
    return navigateTo('/auth/login');
  }

  // Si el usuario está autenticado
  else {
    // Redirige a la página de inicio si intenta acceder a rutas /auth/
    if (to.path.startsWith('/auth/')) {
      return navigateTo('/');
    }
  }
});