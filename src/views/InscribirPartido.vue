<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";
import { getFirestore} from "firebase/firestore";
import { getPartidoById, inscribirPartido } from "../services/partidos";


const auth = getAuth();
const db = getFirestore();

const route = useRoute();
const { partido , loading } = usePartido(route.params.id);
const partidoFiltrado = ref(null); // Variable reactiva para almacenar el partido

onMounted(async () => {
  try {
    const partido = await getPartidoById(route.params.id);
    console.log('partido desde function', partido)
    partidoFiltrado.value = partido;

  } catch (error) {
    console.error(error.message); 
  }
});

async function inscribirseAlPartido() {
  debugger
  try {
    if (partidoFiltrado.value) {
      await inscribirPartido(partidoFiltrado.value.id); 
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
        <h2>Inscripción a partido {{ partidoFiltrado ? partidoFiltrado.nombre : '' }}</h2>
        <h3 class="mb-3 fs-4 text-center">{{ }}</h3>
        <p>{{ partidoFiltrado ? partidoFiltrado.fecha : '' }}</p>
        <p>{{ partidoFiltrado ? partidoFiltrado.totalJ : '' }}</p>
        <ul>
          <li v-for="nombreJugador in partidoFiltrado ? partidoFiltrado.contadorInscriptos : []" :key="nombreJugador">
            {{ nombreJugador }}
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