<template>
    <DashboardLayout>
        <h1 class="text-2xl font-bold mb-6">Configurar Dificultats</h1>

        <div v-if="loadingInitial" class="text-center py-10">
            <p>Carregant configuracions...</p>
        </div>

        <div v-if="errorInitial"
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span class="font-medium">Error en carregar!</span> {{ errorInitial }}
        </div>

        <div v-if="!loadingInitial && !errorInitial" class="space-y-8">

            <div v-for="config in difficulties" :key="config.id"
                class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-5 capitalize border-b pb-2 dark:border-gray-600">{{
                    config.difficulty }}</h2>

                <form @submit.prevent="saveDifficulty(config)">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">

                        <div v-for="(enemy, index) in config.enemies" :key="`${config.id}-${enemy.name}`"
                            class="flex flex-col items-center p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <img :src="getEnemyImageUrl(enemy.name)" :alt="`Imatge de ${enemy.name}`"
                                class="w-16 h-16 object-contain mb-3" @error="onImageError" />
                            <span class="font-medium mb-2 capitalize dark:text-white">{{ enemy.name }}</span>
                            <input type="number" min="0" v-model.number="enemy.quantity"
                                class="w-20 p-2 text-center border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                :aria-label="`Quantitat de ${enemy.name}`" />
                        </div>
                    </div>

                    <div class="flex items-center justify-end space-x-4">
                        <span v-if="saveSuccess[config.id]" class="text-sm text-green-600 dark:text-green-400">Guardat
                            correctament!</span>
                        <span v-if="saveError[config.id]" class="text-sm text-red-600 dark:text-red-400">Error: {{
                            saveError[config.id] }}</span>

                        <button type="submit" :disabled="saving[config.id]"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ saving[config.id] ? 'Guardant...' : 'Guardar Canvis' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// Configuración API (Asegúrate que API_BASE_URL está en nuxt.config.ts)
const config = useRuntimeConfig();
const API_BASE_URL = config.public.API_CONFIG_URL;
const DIFFICULTIES_ENDPOINT = '/config-enemies/difficulties'; // Endpoint GET y base para POST

// Estado reactivo
const difficulties = ref([]); // Almacenará los datos de [ { id: 0, difficulty: 'facil', enemies: [...] }, ... ]
const loadingInitial = ref(true); // Estado de carga para la obtención inicial
const errorInitial = ref(null);   // Error durante la carga inicial

// Estados para guardar (por ID de dificultad)
const saving = reactive({});      // Objeto para rastrear el estado de guardado: saving[difficultyId] = true/false
const saveError = reactive({});   // Objeto para rastrear errores de guardado: saveError[difficultyId] = 'mensaje'
const saveSuccess = reactive({}); // Objeto para mostrar mensaje de éxito: saveSuccess[difficultyId] = true

// --- Funciones ---

// Construye la URL de la imagen del enemigo
const getEnemyImageUrl = (enemyName) => {
    // Asume que las imágenes están en /public/enemies-images/nombreEnemigo.png
    // Asegúrate que el nombre del enemigo en la API coincide con el nombre del archivo (case sensitive!)
    return `/enemies-images/${enemyName}.png`;
};

// Fallback por si una imagen no carga
const onImageError = (event) => {
    console.warn('No se pudo cargar la imagen:', event.target.src);
    // Opcional: poner una imagen por defecto
    // event.target.src = '/path/to/default-enemy.png';
};


// Obtener las configuraciones de dificultad iniciales
const fetchDifficulties = async () => {
    loadingInitial.value = true;
    errorInitial.value = null;
    try {
        const response = await $fetch(`${API_BASE_URL}${DIFFICULTIES_ENDPOINT}`);
        difficulties.value = response; // Asigna la respuesta al estado reactivo

        // Inicializar estados de guardado para cada dificultad
        response.forEach(diff => {
            saving[diff.id] = false;
            saveError[diff.id] = null;
            saveSuccess[diff.id] = false;
        });

    } catch (err) {
        console.error("Error al cargar las dificultades:", err);
        errorInitial.value = err.data?.message || err.message || "No se pudieron cargar las configuraciones.";
    } finally {
        loadingInitial.value = false;
    }
};

// Guardar las cantidades para una dificultad específica
const saveDifficulty = async (difficultyConfig) => {
    const difficultyId = difficultyConfig.id;

    // Indicar que se está guardando y limpiar errores/éxito previos
    saving[difficultyId] = true;
    saveError[difficultyId] = null;
    saveSuccess[difficultyId] = false;


    // Preparar el payload con el formato esperado por el POST
    const payload = {
        enemies: difficultyConfig.enemies.map(enemy => ({
            name: enemy.name,
            quantity: Number(enemy.quantity) || 0 // Asegura que sea un número, 0 si no es válido
        }))
    };


    // Construir la URL específica para el POST
    const postUrl = `${API_BASE_URL}${DIFFICULTIES_ENDPOINT}/${difficultyId}/quantities`;
    const token = authStore.token;

    try {
        await $fetch(postUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Si necesitas autenticación, descomentar y añadir el token

                // Añadir headers de autenticación si son necesarios
            },
            body: payload,
        });

        // Mostrar mensaje de éxito temporalmente
        saveSuccess[difficultyId] = true;
        setTimeout(() => {
            saveSuccess[difficultyId] = false;
        }, 3000); // Ocultar después de 3 segundos


    } catch (err) {
        console.error(`Error al guardar la dificultad ${difficultyId}:`, err);
        saveError[difficultyId] = err.data?.message || err.message || "Ocurrió un error al guardar.";
    } finally {
        saving[difficultyId] = false; // Terminar estado de guardado
    }
};

// --- Ciclo de vida ---

// Cargar los datos cuando el componente se monta
onMounted(() => {
    fetchDifficulties();
});

</script>

<style scoped>
/* Estilo para capitalizar texto (si Tailwind no lo hace directamente en la clase) */
.capitalize {
    text-transform: capitalize;
}

/* Ajustes menores si son necesarios */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
    /* Firefox */
}
</style>