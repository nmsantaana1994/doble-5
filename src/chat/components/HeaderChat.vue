<!-- <script setup>
import Image from "../../components/Image.vue";
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  otherUser: {
    type: Object,
    required: true,
  },
  isOnline: Boolean,
});

const router = useRouter();

function goBack() {
  router.push("/chat");
}
</script>

<template>
  <div class="row sectionHeader">
    <div class="col-2" @click="goBack">
      <img src="../../assets/img/flecha-izquierda-blanca.png" />
      <i class="fi fi-sr-angle-left"></i>
    </div>
    <div class="col-10 d-flex justify-content-start title_chat">
      <div class="image-container">
        <Image :src="otherUser.photoURL" />
      </div>
      <div>
        <h1 class="truncate-title">
          {{ otherUser.displayName ? otherUser.displayName : otherUser.nombre }}
        </h1>
        <span v-if="isOnline" style="color: white; font-size: 0.8rem"
          >● En línea</span
        >
        <span v-else style="color: white; font-size: 0.8rem"
          >● Desconectado</span
        >
      </div>
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
  background-image: url("../../assets/img/background-partidos.png");
  background-repeat: none;
  background-size: cover;
  height: 75px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  color: white;
}

.sectionHeader {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
}

.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.title_chat > div:last-child {
  min-width: 0;
  flex: 1;
}

.title_chat {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.image-container {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

h1 {
  margin: auto 0;
  text-align: start;
  font-size: 1.5rem;
}
img {
  width: 60px;
  height: 60px;
}
</style> -->
<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import Image from "../../components/Image.vue";

import flechaBlanca from "../../assets/img/flecha-izquierda-blanca.png";
import flechaNegra from "../../assets/img/flecha-izquierda.png";

const props = defineProps({
  otherUser: {
    type: Object,
    required: true,
  },
  isOnline: Boolean,
  hasBackground: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();

function goBack() {
  router.push("/chat");
}
</script>

<template>
  <div
    class="row sectionHeader"
    :class="{
      'with-background': props.hasBackground,
      'no-background': !props.hasBackground,
    }"
  >
    <div class="col-2" @click="goBack">
      <img
        :src="props.hasBackground ? flechaBlanca : flechaNegra"
        alt="Volver"
      />
    </div>

    <div class="col-10 d-flex justify-content-start title_chat">
      <div class="image-container">
        <Image :src="otherUser.photoURL" />
      </div>
      <div>
        <h1 class="truncate-title">
          {{ otherUser.displayName || otherUser.nombre }}
        </h1>
        <span
          :style="{
            color: props.hasBackground ? 'white' : 'black',
            fontSize: '0.8rem',
          }"
        >
          ● {{ isOnline ? "En línea" : "Desconectado" }}
        </span>
      </div>
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
  height: 75px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.with-background {
  background-image: url("../../assets/img/background-partidos.png");
  background-repeat: no-repeat;
  background-size: cover;
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

.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.title_chat > div:last-child {
  min-width: 0;
  flex: 1;
}

.title_chat {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

h1 {
  margin: auto 0;
  text-align: start;
  font-size: 1.5rem;
}

img {
  width: 60px;
  height: 60px;
}
</style>
