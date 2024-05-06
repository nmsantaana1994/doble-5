<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import Image from "../components/Image.vue";
import { getAuth } from "firebase/auth";
import { ref, onMounted, onUnmounted } from "vue";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getPartidoById, inscribirPartido } from "../services/partidos";

const auth = getAuth();
const db = getFirestore();
const route = useRoute();
const { loading } = usePartido(route.params.id);
const partidoFiltrado = ref(null);

const partidoDocRef = doc(db, "partidos", route.params.id);

onMounted(async () => {
  try {
    const partido = await getPartidoById(route.params.id);
    partidoFiltrado.value = partido;
    console.log(partidoFiltrado.value)
    // Escuchar cambios en el documento del partido
    listenToChanges();
  } catch (error) {
    console.error(error.message);
  }
});

// // Función para suscribirse a los cambios en el documento del partido
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
    //   console.log("Usuario inscrito correctamente.");
    } else {
    //   console.error("No se ha encontrado el partido para inscribirse.");
    }
  } catch (error) {
    console.error("Error al inscribirse al partido:", error);
  }
}
</script>

<template>
  <LoadingContext :loading="loading">
    <section class="row p-1 m-0">
      <div class="row">
        <div class="col-12">
          IMAGEN DE MAPA
        </div>
        </div>
        <div class="row">
          <div class="col-7">
          {{partidoFiltrado ? partidoFiltrado.complejo: '-'}}
        </div>
        <div class="col-3">
          {{partidoFiltrado ? partidoFiltrado.tipo: '-'}}
        </div>
        <div class="col-2">
          {{partidoFiltrado ? partidoFiltrado.cantidadJ: '-'}}
        </div>
      </div>

      <div class="row">
        <div class="col-12">
        <p> <span class="fw-bold">Direccion:</span> {{ partidoFiltrado ? partidoFiltrado.complejo : "-" }}</p>
        </div>
        <div class="col-12">
        <p><span class="fw-bold"> Dia:</span> {{ partidoFiltrado ? partidoFiltrado.fecha : "-" }}</p>
        </div>
        <div class="col-12">
        <p><span class="fw-bold"> Horario:</span> {{ partidoFiltrado ? partidoFiltrado.hora : "-" }}</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
        <p class="text-center fs-2 fw-bold">Jugadores</p>
        </div>
      </div>
      
      <!-- <div class="row"> -->
        <div class="row" v-for="nombreJugador in partidoFiltrado
        ? partidoFiltrado.contadorInscriptos
        : []"
        :key="nombreJugador">
          <div class="col-3">
                <Image :src="nombreJugador.image" class="rounded-circle foto-perfil" />
          </div>
          <div class="col-9">
            <p>{{ nombreJugador.nombre }}
              <router-link :to="`/usuario/${nombreJugador.uid}`">
                ver perfil
              </router-link>
            </p>
          </div>
        <!-- <ul>
            <li class="col-6"
                
              >
                <router-link :to="`/usuario/${nombreJugador.uid}`">
                  {{ nombreJugador.nombre }}
                </router-link>
              </li>
            <li class="col-6"
                v-for="nombreJugador in partidoFiltrado
                  ? partidoFiltrado.contadorInscriptos
                  : []"
                :key="nombreJugador"
              >
                <router-link :to="`/usuario/${nombreJugador.uid}`">
                  {{ nombreJugador.nombre }}
                </router-link>
              </li>
        </ul> -->
      </div>

      <div class="row">
          <div class="col-12">
            <button class="" @click="inscribirseAlPartido">Sumarme al partido</button>
          </div>
      </div>
  </section>
  </LoadingContext>
</template>

<style scoped>

ul{
  list-style: none;
}
</style>
