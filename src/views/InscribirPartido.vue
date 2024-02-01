<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth } from "firebase/auth";
import { ref, onMounted, onUnmounted } from "vue";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getPartidoById, inscribirPartido } from "../services/partidos";

const auth = getAuth();
const db = getFirestore();
const user = auth.currentUser;
const route = useRoute();
const { partido, loading } = usePartido(route.params.id);
const partidoFiltrado = ref(null);

const partidoDocRef = doc(db, "partidos", route.params.id);

onMounted(async () => {
  try {
    const partido = await getPartidoById(route.params.id);
    partidoFiltrado.value = partido;

    // Escuchar cambios en el documento del partido
    listenToChanges();
  } catch (error) {
    console.error(error.message);
  }
});

// Función para suscribirse a los cambios en el documento del partido
function listenToChanges() {
  const unsubscribe = onSnapshot(partidoDocRef, (snapshot) => {
    if (snapshot.exists()) {
      partidoFiltrado.value = { ...snapshot.data(), id: snapshot.id };
    } else {
      partidoFiltrado.value = null;
    }
  });

  // Detener la escucha de cambios cuando el componente se desmonte
  onUnmounted(unsubscribe);
}

async function inscribirseAlPartido() {
  try {
    if (partidoFiltrado.value) {
      await inscribirPartido(route.params.id, auth.currentUser);
      console.log("Usuario inscrito correctamente.");
    } else {
      console.error("No se ha encontrado el partido para inscribirse.");
    }
  } catch (error) {
    console.error("Error al inscribirse al partido:", error);
  }
}
</script>

<template>
  <LoadingContext :loading="loading">
    <section class="row p-1 m-0">
      <div class="col-12">
        <h2>
          Inscripción a partido
          {{ partidoFiltrado ? partidoFiltrado.nombre : "" }}
        </h2>
        <h3 class="mb-3 fs-4 text-center">{{}}</h3>
        <p>Fecha del partido: {{ partidoFiltrado ? partidoFiltrado.fecha : "" }}</p>
        <p>Cantidad total de jugadores: {{ partidoFiltrado ? partidoFiltrado.cantidadJ*2 : "" }}</p>
        <h3>Usuarios inscriptos: </h3>
        <ul>
          <li
            v-for="nombreJugador in partidoFiltrado
              ? partidoFiltrado.contadorInscriptos
              : []"
            :key="nombreJugador"
          >
          <router-link :to="`/usuario/${nombreJugador.uid}`">
            {{ nombreJugador.nombre }}
          </router-link>
          </li>
        </ul>
        <!-- Llama a la función inscribirseAlPartido cuando se hace clic en el botón -->
        <button @click="inscribirseAlPartido">Sumarme al partido</button>
      </div>
    </section>
  </LoadingContext>
</template>

<style scoped>
img {
  width: 80%;
}
</style>
