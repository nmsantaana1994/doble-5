<template>
    <div v-if="loading" class="loader-container">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Definir las props del componente
  const props = defineProps({
    loading: {
      type: Boolean,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
    z-index: 9999; /* Asegúrate de que esté encima de otros elementos */
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
  </style>