<script setup>
    defineProps({
        full: {
            type: Boolean,
            default: false,
        }
    })
</script>

<template>
    <button
        type="submit"
        class="p-1"
        :class="{
            'w-full':full,
        }"
    >
        <slot>Enviar</slot>
    </button>
</template>