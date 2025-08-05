<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getPartidos } from "../services/partidos";
import { ref, onMounted } from "vue";
import cardPartido from "../components/CardPartido.vue";
const auth = getAuth();

const partidos = ref([]);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    getPartidosForUser(uid);
  } else {
    console.log("Usuario no autenticado");
  }
});

async function getPartidosForUser(UsuarioId) {
  const partidosData = await getPartidos();

  const filteredPartidos = partidosData.filter((partido) => {
    const esCreador = partido.userId === UsuarioId;
    const estaInscripto = partido.contadorInscriptos?.some(
      (jugador) => jugador.uid === UsuarioId
    );
    return esCreador || estaInscripto;
  });
  partidos.value = filteredPartidos;
}

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    await getPartidosForUser(uid);
  }
});
</script>

<template>
  <section class="px-3 pb-3 my-5">
    <div class="row mb-3">
      <div class="col-10">
        <h2 class="text-start h3">
          <span class="text-decoration-underline">Mis</span> partidos
        </h2>
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
      <cardPartido
        v-for="partido in partidos"
        :key="partido.id"
        :partido="partido"
      />
    </template>

    <template v-else>
      <div class="row px-3">
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

.icono-card {
  width: 55%;
}

a {
  text-decoration: none;
  color: black;
}

.card-body {
  padding: 0;
}

.fondo-boton-card {
  background-color: #5d880d;
  width: 45%;
}

.fondo-boton-card-negro {
  background-color: #000000;
  width: 45%;
}
</style>
