<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composition/useAuth.js";

const chats = ref([]);
const router = useRouter();
const { user } = useAuth();

const accederChat = (chatId) => {
  // Navega al componente PrivateChat.vue pasando el chatId como parámetro
  router.push(`/private-chat/${chatId}`);
};
</script>

<template>
  <section class="row py-3 m-0">
    <div class="col-3 d-flex justify-content-center align-items-center">
      <router-link :to="`/home`">
        <img src="../../assets/img/flecha-izquierda.png" />
        <i class="fi fi-sr-angle-left"></i>
      </router-link>
    </div>
    <div class="col-9 d-flex align-items-center">
      <h1 class="text-center">
        En construcción
        <!--Información-->
      </h1>
    </div>
  </section>
</template>

<style scoped>
img {
  width: 80%;
}
</style>
