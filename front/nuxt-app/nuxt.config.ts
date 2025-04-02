import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      API_CONFIG_URL: process.env.API_CONFIG_URL,
      API_AUTH_URL: process.env.API_AUTH_URL,
      API_STATISTICS_URL: process.env.API_STATISTICS_URL,
    },
  },
  modules: ['@pinia/nuxt'],
  
})
