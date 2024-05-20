<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  route: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>
<template>
    <section class="p-3">
      <div class="row">
        <div class="col-3 d-flex justify-content-center">
          <router-link :to="props.route">
            <img src="../assets/img/flecha-izquierda.png" style="width: 80%;" />
            <i class="fi fi-sr-angle-left"></i>
          </router-link>
        </div>
        <div class="col-9 d-flex align-items-center">
          <h1 class="text-center m-0 ps-4">{{ props.title }}</h1>
        </div>
      </div>
    </section>
    <hr>
  </template>
<style scoped></style>