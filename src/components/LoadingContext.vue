<script setup>
import Loader from "./Loader.vue";

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <template class="modal" v-if="!loading">
        <slot />
    </template>
    <template class="modal" v-else>
        <Loader />
    </template>
</template>

<style scoped>
</style>