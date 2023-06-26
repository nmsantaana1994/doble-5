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
    <template v-if="!loading">
        <slot />
    </template>
    <template v-else>
        <Loader />
    </template>
</template>