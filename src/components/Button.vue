<script setup>
import LoadingContext from "./LoadingContext.vue";

defineProps({
  full: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    type="submit"
    class="btn"
    :class="{
      'w-full': full,
    }"
  >
    <LoadingContext :loading="loading">
      <slot>Enviar</slot>
    </LoadingContext>
  </button>
</template>

<style scoped>
button {
  background-color: #5d880d;
  border: none;
}
</style>
