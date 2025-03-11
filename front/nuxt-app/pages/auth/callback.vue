<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
        <Loader />
    </div>
</template>

<script setup>
import { onMounted } from "vue";

const { processUserFromQuery } = useAuth();

onMounted(() => {
    processUserFromQuery();
});
</script>