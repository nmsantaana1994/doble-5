<script setup>
import Image from "../../components/Image.vue";
import { useAuth } from "../../composition/useAuth.js";
import { ref, onUnmounted, onBeforeMount } from "vue";
import {
  onSnapshot,
  getFirestore,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import CardPartido from "../../partidos/components/CardPartido.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const { user } = useAuth();
const db = getFirestore();
const partidos = ref([]);
let unsubscribe = null;

function isActive(path) {
  return route.path === path ? "active-button" : "";
}

function listenToPartidosActivos() {
  const q = query(
    collection(db, "partidos"),
    orderBy("fecha", "asc"),
    where("estado", "==", "activo"),
    limit(3)
  );
  unsubscribe = onSnapshot(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((doc) => {
      lista.push({ ...doc.data(), id: doc.id });
    });
    partidos.value = lista;
  });
}

onBeforeMount(() => {
  listenToPartidosActivos();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <section class="px-5 py-4">
    <div class="header row mb-3">
      <div class="col-5 w-home">
        <Image :src="user.photoURL" />
      </div>
      <div class="col-7 d-flex align-items-center">
        <p class="text-start h3">
          {{ user.displayName ? user.displayName : user.nombre }} <br /><span
            class="h4 bienvenida"
            >¡Bienvenido!</span
          >
        </p>
      </div>
    </div>
  </section>

  <section class="px-5 pb-3">
    <div class="row d-flex justify-content-between mb-3">
      <div
        class="col-3 m-auto justify-content-center botonera-home"
        :class="['botonera-home', isActive('/home')]"
      >
        <router-link :to="'/home'" class="d-flex flex-column">
          <img
            src="../../assets/img/home-offcanvas.png"
            alt="Icono home"
            class="icono-card m-auto"
          />
          <p class="m-auto">Home</p>
        </router-link>
      </div>
      <div
        class="col-3 m-auto justify-content-center botonera-home"
        :class="['botonera-home', isActive('/feed')]"
      >
        <router-link :to="'/feed'" class="d-flex flex-column">
          <img
            src="../../assets/img/red-social.png"
            alt="Icono feed"
            class="icono-card m-auto"
          />
          <p class="m-auto">Feed</p>
        </router-link>
      </div>
      <div
        class="col-3 m-auto justify-content-center botonera-home"
        :class="['botonera-home', isActive('/partidos')]"
      >
        <router-link :to="'/partidos'" class="d-flex flex-column">
          <img
            src="../../assets/img/pelota.png"
            alt="Icono pelota"
            class="icono-card m-auto"
          />
          <p class="m-auto">Partidos</p>
        </router-link>
      </div>
      <div
        class="col-3 m-auto justify-content-center botonera-home"
        :class="['botonera-home', isActive('/red')]"
      >
        <router-link :to="'/red'" class="d-flex flex-column">
          <img
            src="../../assets/img/usuarios.png"
            alt="Icono red"
            class="icono-card m-auto"
          />
          <p class="m-auto">Red</p>
        </router-link>
      </div>
    </div>
  </section>

  <section class="pb-3 px-4">
    <div class="row mb-3">
      <div class="col-10">
        <h2 class="text-start h3 mb-3 fw-bold"><span>Próximos</span> partidos</h2>
      </div>
      <div class="col-2">
        <router-link to="/partidos">
          <img
            src="../../assets/img/arrows-right.png"
            alt="Icono flechas dobles"
            class="icono-h2"
          />
        </router-link>
      </div>
    </div>
    <template v-if="partidos.length > 0">
      <div class="row px-3">
        <CardPartido
          class="m-auto"
          v-for="partido in partidos"
          :key="partido.id"
          :partido="partido"
        />
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <p>No hay partidos para mostrar</p>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.icono-h2 {
  width: 25px;
  height: 25px;
}

.w-home{
  width: 30%;
}

h2 span {
  border-bottom: 3px solid #5d880d;
}
.bienvenida {
  color: #5d880d;
}
.botonera-home {
  width: 4.5rem;
  height: 4.5rem;
  background-color: #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

a {
  text-decoration: none;
  color: black;
  font-weight: 400;
  font-size: 0.9rem;
}

.icono-card {
  width: 45%;
}

.active-button {
  background-color: #73a812 !important;
  color: white;
}

.active-button img,
.active-button p {
  filter: brightness(0) invert(1); /* para íconos negros en blanco */
  color: white;
}
</style>
