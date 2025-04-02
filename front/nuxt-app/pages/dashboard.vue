<template>
    <DashboardLayout>
      <h1 class="text-2xl font-bold mb-6">Dashboard Principal</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
        <NuxtLink
          to="/players"
          class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
        >
          <div class="flex flex-col items-center text-center">
            <img
              src="/g-icon.png"
              alt="Icona de Players"
              class="w-12 h-12 mb-3 opacity-75"
            />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Players
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Gestionar jugadors
            </p>
          </div>
        </NuxtLink>
  
        <NuxtLink
          to="/enemies"
          class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
        >
          <div class="flex flex-col items-center text-center">
            <img
              src="/enemies-icon.png"
              alt="Icona d'Enemics"
              class="w-12 h-12 mb-3 opacity-75"
            />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Enemics
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Veure enemics del joc
            </p>
          </div>
        </NuxtLink>
  
        <NuxtLink
          to="/difficulties"
          class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
        >
          <div class="flex flex-col items-center text-center">
            <img
              src="/d-icon.png" alt="Icona de Difficulties"
              class="w-12 h-12 mb-3 opacity-75"
            />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Difficulties
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Configurar dificultats
            </p>
          </div>
        </NuxtLink>
  
        <NuxtLink
          to="/statistics"
          class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
        >
          <div class="flex flex-col items-center text-center">
            <img
              src="/statistics-icon.png"
              alt="Icona de Statistics"
              class="w-12 h-12 mb-3 opacity-75"
            />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Statistics
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Veure estadístiques
            </p>
          </div>
        </NuxtLink>
  
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  </style>