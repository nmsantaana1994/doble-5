<script setup>
</script>

<template>
    <!-- <div class="loader"><div class="visually-hidden"><slot>Cargando...</slot></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> -->
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  z-index: 9999; /* Asegúrate de que esté encima de otros elementos */
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>