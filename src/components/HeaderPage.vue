<script setup>
import { defineProps, onMounted, ref } from "vue";
import router from "../router/router";

import flechaBlanca from "../assets/img/flecha-izquierda-blanca.png";
import flechaNegra from "../assets/img/flecha-izquierda.png";
const goBack = ref("/"); // fallback a home
const props = defineProps({
  route: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  hasBackground: {
    type: Boolean,
    default: true,
  },
});

onMounted(() => {
  const lastRoute = sessionStorage.getItem("previousRoute");
  if (lastRoute && lastRoute !== window.location.hash.slice(1)) {
    goBack.value = lastRoute;
  }
});
</script>

<template>
  <div
    class="row sectionHeader"
    :class="{
      'with-background': props.hasBackground,
      'no-background': !props.hasBackground,
    }"
  >
    <div class="col-3">
      <router-link :to="goBack">
        <img
          :src="props.hasBackground ? flechaBlanca : flechaNegra"
          alt="Volver"
        />
      </router-link>
    </div>
    <div class="col-9">
      <h1>{{ props.title }}</h1>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 4;
  height: 85px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.with-background {
  background-color: #5d880d;
  color: white;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}

.no-background {
  background-color: white;
  background-image: none;
  color: black;
}

.sectionHeader {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
}

.sectionHeader div:last-child h1 {
  width: 70%;
  margin-left: 0;
  text-align: center;
}

img {
  width: 60px;
  height: 60px;
}

h1 {
  margin: auto;
  text-align: right;
  font-size: 1.5rem;
}
</style>
