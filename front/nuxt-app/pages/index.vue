<template>
    <h1 class="text-3xl font-bold underline">
        index.vue
    </h1>
</template>

<script setup>
import { useAuth } from "~/services/useAuth";

const { login } = useAuth();


</script>