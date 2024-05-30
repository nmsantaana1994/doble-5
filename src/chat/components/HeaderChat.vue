<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  otherUser: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <h1 class="title_chat mb-3">Chat privado con {{ otherUser.displayName ? otherUser.displayName : otherUser.nombre }}</h1>
</template>

<style scoped>
.title_chat{
    position:fixed;
    width: 100%;
    background-color: white;
    height: 60px;
    padding-top: 15px;
    text-align: center;
    color: white;
    background-color: var(--primary-color);
}
</style>