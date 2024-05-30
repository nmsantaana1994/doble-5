<script setup>
import Image from "../../components/Image.vue"
import { defineProps } from 'vue';


const props = defineProps({
  otherUser: {
    type: Object,
    required: true
  }
});
</script>

<template>
<div class="title_chat">
  <Image :src="otherUser.photoURL" class="rounded-circle foto-perfil" />
  <h1>{{ otherUser.displayName ? otherUser.displayName : otherUser.nombre }}</h1>
</div>
</template>

<style scoped>
.title_chat{
    position:fixed;
    width: 100%;
    background-color: white;
    max-height: 60px;
    padding: 8px 0;
    text-align: center;
    color: white;
    background-color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
}
.foto-perfil {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
h1{
  margin: auto 0;
}
</style>