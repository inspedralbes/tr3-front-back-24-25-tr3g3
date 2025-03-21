<template>
    <DashboardLayout>
        <div class="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Lista de enemigos con buscador -->
            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Enemigos Disponibles</h2>

                <!-- Buscador -->
                <div class="mb-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Buscar enemigo..."
                            class="w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
                        <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="overflow-auto max-h-[calc(100vh-18rem)]">
                    <div v-for="(enemy, index) in filteredEnemies" :key="index"
                        @click="selectEnemy(enemies.indexOf(enemy))"
                        class="p-3 mb-2 rounded-md cursor-pointer flex items-center transition-colors duration-200"
                        :class="selectedEnemyIndex === enemies.indexOf(enemy) ? 'bg-blue-200 border-l-4 border-blue-500' : 'bg-white hover:bg-gray-200'">
                        <div class="w-12 h-12 mr-3 bg-gray-300 rounded-md flex items-center justify-center text-xl">
                            <!-- Reemplazamos el icono con la imagen -->
                            <img :src="enemy.img" alt="Enemy Image" class="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                            <p class="font-medium">{{ enemy.name }}</p>
                            <p class="text-sm text-gray-600">Nivel {{ enemy.level }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Configuración de enemigo seleccionado -->
            <div class="md:col-span-2 bg-gray-100 p-4 rounded-lg shadow-md" v-if="selectedEnemyIndex !== null">
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                    <span>Configurar {{ selectedEnemy.name }}</span>
                    <span class="ml-2 px-2 py-1 bg-gray-200 text-xs rounded-full">Nivel {{ selectedEnemy.level }}</span>
                </h2>

                <div class="bg-white p-4 rounded-md shadow-sm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <!-- Nombre -->
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
                            <input v-model="selectedEnemy.name" type="text"
                                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
                        </div>

                        <!-- Nivel -->
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-700">Nivel</label>
                            <input v-model.number="selectedEnemy.level" type="number" min="1"
                                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
                        </div>
                    </div>

                    <!-- Atributos dinámicos -->
                    <div class="space-y-4">
                        <h3 class="font-medium text-lg border-b pb-2">Atributos</h3>

                        <div v-for="(value, key) in selectedEnemy.stats" :key="key" class="mb-4">
                            <div class="flex justify-between items-center">
                                <label class="block text-sm font-medium text-gray-700">
                                    {{ formatAttributeName(key) }}: {{ value }}
                                </label>
                                <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                    {{ getAttributeUnit(key) }}
                                </span>
                            </div>
                            <input v-model.number="selectedEnemy.stats[key]" type="range"
                                :min="getAttributeMin(key)" :max="getAttributeMax(key)" :step="getAttributeStep(key)"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                    </div>

                    <div class="mt-6">
                        <button @click="saveEnemyChanges"
                            class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mensaje de selección cuando no hay enemigo seleccionado -->
            <div class="md:col-span-2 bg-gray-100 p-8 rounded-lg shadow-md flex items-center justify-center" v-else>
                <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-gray-500 text-lg">Selecciona un enemigo para configurarlo</p>
                </div>
            </div>
        </div>

    </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';

// Lista de enemigos con atributos dinámicos
const enemies = ref([
    {
        name: 'Grunt',
        level: 1,
        img: '/profile-icon.jpg',
        stats: {
            shootingDistance: 2,
            maxHealth: 1,
            enemyDamage: 2
        }
    },
    {
        name: 'Lobo',
        level: 2,
        img: '/profile-icon.jpg',
        stats: {
            damage: 2,
            detectionRange: 3.0,
            maxHealth: 1,
            moveSpeed: 2.0
        }
    },
    {
        name: 'Ogro',
        level: 4,
        img: '/profile-icon.jpg',
        stats: {
            maxHealth: 6,
            damage: 3,
            attackCooldown: 4.0,
            detectionRange: 1.8
        }
    },
    {
        name: 'Fantasma',
        level: 3,
        img: '/profile-icon.jpg',
        stats: {
            moveSpeed: 4.0,
            detectionRange: 6.0,
            maxHealth: 1
        }
    },
    {
        name: 'Caballo',
        level: 5,
        img: '/profile-icon.jpg',
        stats: {
            maxHealth: 6,
            damage: 3,
            moveSpeed: 2.0,
            chargeDistance: 1.1
        }
    },
    {
        name: 'Grunt',
        level: 1,
        img: '/profile-icon.jpg',
        stats: {
            shootingDistance: 2,
            maxHealth: 1,
            enemyDamage: 2
        }
    },
    {
        name: 'Lobo',
        level: 2,
        img: '/profile-icon.jpg',
        stats: {
            damage: 2,
            detectionRange: 3.0,
            maxHealth: 1,
            moveSpeed: 2.0
        }
    },
    {
        name: 'Ogro',
        level: 4,
        img: '/profile-icon.jpg',
        stats: {
            maxHealth: 6,
            damage: 3,
            attackCooldown: 4.0,
            detectionRange: 1.8
        }
    },
    {
        name: 'Fantasma',
        level: 3,
        img: '/profile-icon.jpg',
        stats: {
            moveSpeed: 4.0,
            detectionRange: 6.0,
            maxHealth: 1
        }
    },
    {
        name: 'Caballo',
        level: 5,
        img: '/profile-icon.jpg',
        stats: {
            maxHealth: 6,
            damage: 3,
            moveSpeed: 2.0,
            chargeDistance: 1.1
        }
    },
]);

// Índice del enemigo seleccionado
const selectedEnemyIndex = ref(null);

// Enemigo seleccionado (copia para editar)
const selectedEnemy = ref(null);

// Término de búsqueda
const searchQuery = ref('');

// Configuración de atributos (min, max, step, unidad, icono)
const attributeConfig = {
    maxHealth: { min: 1, max: 20, step: 1, unit: 'HP', icon: '❤️' },
    damage: { min: 1, max: 10, step: 1, unit: 'DMG', icon: '⚔️' },
    enemyDamage: { min: 1, max: 10, step: 1, unit: 'DMG', icon: '⚔️' },
    moveSpeed: { min: 0.5, max: 10, step: 0.1, unit: 'units/s', icon: '🏃' },
    detectionRange: { min: 0.5, max: 10, step: 0.1, unit: 'units', icon: '👁️' },
    attackCooldown: { min: 0.5, max: 10, step: 0.1, unit: 'seconds', icon: '⏱️' },
    shootingDistance: { min: 1, max: 15, step: 0.5, unit: 'units', icon: '🏹' },
    chargeDistance: { min: 0.1, max: 5, step: 0.1, unit: 'units', icon: '🔋' }
};

// Filtro de enemigos según la búsqueda
const filteredEnemies = computed(() => {
    if (!searchQuery.value) {
        return enemies.value;
    }

    const query = searchQuery.value.toLowerCase();
    return enemies.value.filter(enemy =>
        enemy.name.toLowerCase().includes(query) ||
        enemy.level.toString().includes(query)
    );
});

// Función para seleccionar un enemigo
function selectEnemy(index) {
    selectedEnemyIndex.value = index;
    // Crear una copia profunda del enemigo para editar
    selectedEnemy.value = JSON.parse(JSON.stringify(enemies.value[index]));
}

// Función para guardar los cambios del enemigo
function saveEnemyChanges() {
    if (selectedEnemyIndex.value !== null) {
        enemies.value[selectedEnemyIndex.value] = JSON.parse(JSON.stringify(selectedEnemy.value));
        // Mostrar mensaje de éxito
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
        toast.textContent = 'Cambios guardados correctamente';
        document.body.appendChild(toast);
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);

        console.log(selectedEnemy.value);
    }
}

// Función para formatear nombres de atributos
function formatAttributeName(key) {
    const nameMap = {
        maxHealth: 'Salud Máxima',
        damage: 'Daño',
        enemyDamage: 'Daño',
        moveSpeed: 'Velocidad',
        detectionRange: 'Rango de Detección',
        attackCooldown: 'Enfriamiento de Ataque',
        shootingDistance: 'Distancia de Disparo',
        chargeDistance: 'Distancia de Carga'
    };

    return nameMap[key] || key;
}

// Función para obtener el valor mínimo de un atributo
function getAttributeMin(key) {
    return attributeConfig[key]?.min || 0;
}

// Función para obtener el valor máximo de un atributo
function getAttributeMax(key) {
    return attributeConfig[key]?.max || 100;
}

// Función para obtener el paso de un atributo
function getAttributeStep(key) {
    return attributeConfig[key]?.step || 1;
}

// Función para obtener la unidad de un atributo
function getAttributeUnit(key) {
    return attributeConfig[key]?.unit || '';
}

// Función para obtener el ícono de un atributo
function getAttributeIcon(key) {
    return attributeConfig[key]?.icon || '🔷';
}
</script>

<style scoped></style>