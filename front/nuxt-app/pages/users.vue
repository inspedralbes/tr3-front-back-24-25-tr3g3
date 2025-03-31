<template>
    <DashboardLayout>
      <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
  
      <div class="mb-4">
        <label for="user-search" class="sr-only">Buscar por Email</label>
        <input type="search" id="user-search" v-model="searchQuery" placeholder="Buscar por email..."
               class="block w-full p-2 ps-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
  
      <div v-if="isLoading" class="text-center py-4">Cargando usuarios...</div>
      <div v-if="loadError" class="text-center py-4 text-red-500">{{ loadError }}</div>
  
      <div v-if="!isLoading && !loadError && users.length > 0" class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Nombre</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
               <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                 No hay usuarios que coincidan con la búsqueda "{{ searchQuery }}".
               </td>
            </tr>
            <tr v-else v-for="user in paginatedUsers" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ user.id }}</td>
              <td class="px-6 py-4">{{ user.username }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <button @click="openEditModal(user)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <div v-if="!isLoading && !loadError && users.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
          No se encontraron usuarios.
      </div>
  
      <nav v-if="!isLoading && !loadError && totalPages > 1" class="flex items-center justify-between pt-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Mostrando
          <span class="font-semibold text-gray-900 dark:text-white">{{ paginationInfo.startItem }}-{{ paginationInfo.endItem }}</span>
          de
          <span class="font-semibold text-gray-900 dark:text-white">{{ filteredUsers.length }}</span>
           <span v-if="searchQuery"> (filtrado de {{ users.length }} total)</span>
        </span>
        <ul class="inline-flex items-center -space-x-px">
          <li>
            <button @click="previousPage" :disabled="currentPage === 1"
               :class="['px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white', { 'opacity-50 cursor-not-allowed': currentPage === 1 }]">
              Anterior
            </button>
          </li>
          <li>
            <button @click="nextPage" :disabled="currentPage === totalPages"
               :class="['px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white', { 'opacity-50 cursor-not-allowed': currentPage === totalPages }]">
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
  
      <div v-if="isEditModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-60">
         <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-900">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Editar Usuario</h3>
            <div class="mt-2 px-7 py-3">
              <div class="mb-4 text-left">
                  <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                  <input type="text" id="edit-name" v-model="currentUserToEdit.username" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white">
              </div>
               <div class="mb-4 text-left">
                  <label for="edit-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" id="edit-email" v-model="currentUserToEdit.email" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white">
              </div>
            </div>
            <div class="items-center px-4 py-3">
              <button @click="saveUserChanges" id="save-button" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2">
                Guardar Cambios
              </button>
              <button @click="closeEditModal" id="cancel-button" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
                Cancelar
              </button>
            </div>
             <p v-if="editError" class="text-red-500 mt-2">{{ editError }}</p>
             <p v-if="editSuccess" class="text-green-500 mt-2">{{ editSuccess }}</p>
          </div>
        </div>
      </div>
  
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'; // Importa watch
  import { useUsers } from '@/services/useUsers';
  import DashboardLayout from '@/components/DashboardLayout.vue';
  
  const { getUsers, updateUser } = useUsers();
  
  // --- Estado General ---
  const users = ref([]);
  const isLoading = ref(false);
  const loadError = ref(null);
  
  // --- Estado de Búsqueda ---
  const searchQuery = ref(''); // Para el input de búsqueda
  
  // --- Estado de Edición (Modal) ---
  const isEditModalOpen = ref(false);
  const currentUserToEdit = ref(null);
  const editError = ref(null);
  const editSuccess = ref(null);
  
  // --- Estado de Paginación ---
  const currentPage = ref(1);
  const itemsPerPage = ref(15);
  
  // --- Computed Properties ---
  
  // 1. Filtra usuarios basado en searchQuery
  const filteredUsers = computed(() => {
    if (!users.value) return [];
    if (!searchQuery.value) {
      return users.value; // Retorna todos si no hay búsqueda
    }
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(user =>
      user.email && user.email.toLowerCase().includes(query)
    );
  });
  
  // 2. Calcula totalPages basado en los usuarios FILTRADOS
  const totalPages = computed(() => {
    if (!filteredUsers.value || filteredUsers.value.length === 0) return 0;
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
  });
  
  // 3. Pagina los usuarios FILTRADOS
  const paginatedUsers = computed(() => {
    if (!filteredUsers.value || filteredUsers.value.length === 0) return [];
  
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return filteredUsers.value.slice(startIndex, endIndex);
  });
  
  // 4. Calcula info de paginación basado en los usuarios FILTRADOS
  const paginationInfo = computed(() => {
      const totalFilteredItems = filteredUsers.value.length;
      if (totalFilteredItems === 0) return { startItem: 0, endItem: 0 };
  
      const startItem = (currentPage.value - 1) * itemsPerPage.value + 1;
      const endItem = Math.min(currentPage.value * itemsPerPage.value, totalFilteredItems);
      return { startItem, endItem };
  });
  
  // --- Watchers ---
  
  // Observa cambios en searchQuery y resetea la página a 1
  watch(searchQuery, (newQuery, oldQuery) => {
    if (newQuery !== oldQuery) {
      currentPage.value = 1;
    }
  });
  
  // --- Métodos ---
  
  onMounted(async () => {
    isLoading.value = true;
    loadError.value = null;
    try {
      users.value = await getUsers();
      currentPage.value = 1;
    } catch (error) {
      console.error("No se pudieron cargar los usuarios", error);
      loadError.value = "Error al cargar los usuarios.";
      users.value = [];
    } finally {
        isLoading.value = false;
    }
  });
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  // Funciones del Modal (sin cambios, operan sobre `users.value`)
  const openEditModal = (user) => {
    currentUserToEdit.value = { ...user };
    isEditModalOpen.value = true;
    editError.value = null;
    editSuccess.value = null;
  };
  
  const closeEditModal = () => {
    isEditModalOpen.value = false;
    currentUserToEdit.value = null;
  };
  
  // Guardar cambios actualiza la lista maestra 'users'.
  // Las computed properties (filteredUsers, paginatedUsers) se recalcularán.
  const saveUserChanges = async () => {
    // ... (lógica igual que antes)
     if (!currentUserToEdit.value || !currentUserToEdit.value.id) {
        editError.value = "No hay un usuario seleccionado para editar.";
        return;
    }
    editError.value = null;
    editSuccess.value = null;
    try {
      const updatedUser = await updateUser(currentUserToEdit.value.id, currentUserToEdit.value);
      const index = users.value.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        users.value[index] = updatedUser; // Actualiza la lista maestra
      } else {
          console.warn("Usuario actualizado no encontrado en la lista local.");
      }
      editSuccess.value = "Usuario actualizado correctamente.";
      setTimeout(() => {
          closeEditModal();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      editError.value = error.message || "Error al guardar los cambios. Inténtalo de nuevo.";
    }
  };
  </script>
  
  <style scoped>
  /* Estilos (igual que antes) */
  .z-60 { z-index: 60; }
  .opacity-50 { opacity: 0.5; }
  .cursor-not-allowed { cursor: not-allowed; }
  </style>