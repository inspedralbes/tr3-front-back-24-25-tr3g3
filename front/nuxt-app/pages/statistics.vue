<template>
    <DashboardLayout>
        <h1 class="text-2xl font-bold mb-6">Estadístiques</h1>

        <form @submit.prevent="fetchStatistics" class="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filtrar per
                        Correu electrònic (Opcional)</label>
                    <input type="email" id="email" v-model="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="exemple@domini.com" />
                </div>
                <div>
                    <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filtrar per
                        Data (Opcional)</label>
                    <input type="date" id="fecha" v-model="fecha"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
            </div>
            <p v-if="!email && !fecha" class="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                Si us plau, introdueix un correu electrònic o selecciona una data per generar les estadístiques.
            </p>
            <button type="submit" :disabled="loading || (!email && !fecha)"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Generant...' : 'Generar Estadístiques' }}
            </button>
        </form>

        <div v-if="loading" class="text-center py-4">
            <p>Carregant resultats...</p>
        </div>

        <div v-if="error" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert">
            <span class="font-medium">Error!</span> {{ error }}
        </div>

        <div v-if="imageUrl" class="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Resultats</h2>
            <div class="mb-4">
                <h3 class="text-lg font-medium mb-2">Imatge Generada:</h3>
                <img :src="fullImageUrl" alt="Gràfic d'estadístiques"
                    class="max-w-full h-auto border dark:border-gray-600 rounded" />
            </div>
        </div>

    </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';

// Obtener configuración de runtime para la URL de la API
const config = useRuntimeConfig();
const API_BASE_URL = config.public.API_STATISTICS_URL; // Necesitarás definir esto en tu nuxt.config.ts
const STATISTICS_ENDPOINT = '/generate'; // Cambia esto a tu endpoint real

// Estado reactivo para el formulario y los resultados
const email = ref('');
const fecha = ref(''); // Formato YYYY-MM-DD por el input type="date"
const loading = ref(false);
const error = ref(null);
const imageUrl = ref(null); // Guardará la URL relativa de la imagen

// Calcula la URL completa de la imagen, prefijando con la base de la API
const fullImageUrl = computed(() => {
    if (!imageUrl.value || !API_BASE_URL) {
        return null;
    }
    // Asume que la API_BASE_URL y la URL de la imagen juntas forman la URL completa y accesible
    // Ejemplo: API_BASE_URL = http://localhost:3001, imageUrl = /images/stats_123.png => http://localhost:3001/images/stats_123.png
    console.log(`${API_BASE_URL}/images/${imageUrl.value}`);
    return `${API_BASE_URL}/images/${imageUrl.value}`;
});


// Función para llamar a la API
const fetchStatistics = async () => {
    // Validar que al menos uno de los campos tiene valor
    if (!email.value && !fecha.value) {
        error.value = "Has de proporcionar un correu electrònic o una data.";
        return;
    }

    loading.value = true;
    error.value = null;
    imageUrl.value = null;

    // Construir el payload solo con los campos que tienen valor
    const payload = {};
    if (email.value) {
        payload.email = email.value;
    }
    if (fecha.value) {
        payload.fecha = fecha.value;
    }

    try {
        // Usamos $fetch, el helper de Nuxt para hacer llamadas API
        const response = await $fetch(`${API_BASE_URL}${STATISTICS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Aquí podrías añadir headers de autenticación si son necesarios
                // 'Authorization': `Bearer ${token}`
            },
            body: payload,
        });

        // Procesar la respuesta exitosa
        if (response && response.url) {
            imageUrl.value = response.url; // Guarda la URL relativa
        } else {
            throw new Error("La respuesta de la API no contiene la URL de la imagen.");
        }

    } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        // Intentar obtener un mensaje de error más específico si la API lo proporciona
        error.value = err.data?.message || err.message || "Ocurrió un error al generar las estadísticas.";
    } finally {
        loading.value = false;
    }
};

</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
pre {
    white-space: pre-wrap;
    /* Hace que el contenido del <pre> se ajuste */
    word-wrap: break-word;
    /* Rompe palabras largas si es necesario */
}
</style>