<template>
    <DashboardLayout>
        <!-- Aquí va el contenido específico de esta página -->
        <h1 class="text-2xl font-bold mb-4">Dashboard Principal</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 class="font-bold text-lg mb-2">Ventas Totales</h2>
                <p class="text-3xl font-bold">$24,567</p>
                <p class="text-green-500">+12% desde el mes pasado</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 class="font-bold text-lg mb-2">Usuarios Nuevos</h2>
                <p class="text-3xl font-bold">834</p>
                <p class="text-green-500">+5% desde el mes pasado</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 class="font-bold text-lg mb-2">Tickets Pendientes</h2>
                <p class="text-3xl font-bold">42</p>
                <p class="text-red-500">+8% desde el mes pasado</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 class="font-bold text-lg mb-2">Tasa de Conversión</h2>
                <p class="text-3xl font-bold">3.2%</p>
                <p class="text-green-500">+0.5% desde el mes pasado</p>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
</script>