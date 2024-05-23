<script setup>
import Image from "../../components/Image.vue";
import { useAuth } from "../../composition/useAuth.js";
import { getPartidos } from "../../partidos/services/partidos.js";
import { ref, onUnmounted, onBeforeMount } from "vue";
import { onSnapshot, getFirestore, collection } from "firebase/firestore";
import CardPartido from "../../partidos/components/CardPartido.vue";

const { user } = useHome();
const db = getFirestore();
const partidos = ref([]);

function useHome() {
  const { user } = useAuth();
  return {
    user,
  };
}

async function getPartidosFromService() {
  const partidos = await getPartidos();
  console.log(partidos);
  return partidos;
}

onBeforeMount(async () => {
  partidos.value = await getPartidosFromService();
  const partidoCollectionRef = collection(db, "partidos");
  if (partidoCollectionRef) {
    listenToChanges(partidoCollectionRef);
  }
});

function listenToChanges(partidoCollectionRef) {
  const unsubscribe = onSnapshot(partidoCollectionRef, (snapshot) => {
    partidos.value = []; // Limpiamos la lista actual de partidos
    snapshot.forEach((doc) => {
      partidos.value.push({ ...doc.data(), id: doc.id }); // Agregamos los nuevos partidos a la lista
    });
  });

  // Detenemos la escucha de cambios cuando el componente se desmonta
  onUnmounted(unsubscribe);
}
</script>

<template>
  <section class="p-3">
    <div class="row mb-3">
      <div class="col-4">
        <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
      </div>
      <div class="col-8 d-flex align-items-center">
        <p class="text-start h3">
          {{ user.displayName ? user.displayName : user.nombre }} <br /><span
            class="h4 bienvenida"
            >¡Bienvenido!</span
          >
        </p>
      </div>
    </div>
  </section>

  <section class="px-3 pb-3">
    <div class="row d-flex justify-content-between mb-3">
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/home'" class="d-flex flex-column">
          <img
            src="../../assets/img/home-offcanvas.png"
            alt="Icono home"
            class="icono-card m-auto"
          />
          <p class="m-auto">Home</p>
        </router-link>
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/feed'" class="d-flex flex-column">
          <img
            src="../../assets/img/red-social.png"
            alt="Icono feed"
            class="icono-card m-auto"
          />
          <p class="m-auto">Feed</p>
        </router-link>
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/partidos'" class="d-flex flex-column">
          <img
            src="../../assets/img/pelota.png"
            alt="Icono pelota"
            class="icono-card m-auto"
          />
          <p class="m-auto">Partidos</p>
        </router-link>
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
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

  <section class="pb-3 px-3 mb-5">
    <div class="row mb-3">
      <div class="col-10">
        <h2 class="text-start h3 mb-3">Próximos partidos</h2>
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
      <!-- aqui -->
      <div class="row px-3">
        <CardPartido
          class=" m-auto"
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

.foto-perfil {
  width: 100%;
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
}

.icono-card {
  width: 55%;
}

/* .icono-card {
  width: 55%;
}

a {
  text-decoration: none;
  color: black;
}

.card {
  background-color: #e6e6e6;
  border: 0;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.card-body {
  padding: 0;
}

.fondo-boton-card {
  background-color: #5d880d;
  width: 35%;
}

.fondo-boton-card-negro {
  background-color: #000000;
  width: 35%;
} */
</style>
