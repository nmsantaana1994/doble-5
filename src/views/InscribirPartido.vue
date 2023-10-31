<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getPartidoByNombre } from "../services/partidos";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const route = useRoute();
const { partido, loading } = usePartido(route.params.nombre);

function InscriptionGame() {
  partido.totalJ = partido.cantidadJ * 2;
  const user = auth.currentUser;
  if (user) {
    const userLog = user.displayName;
    console.log("usuario logeado: ", userLog);
    console.log(
      "usuarios inscriptos en partido:",
      partido.value.contadorInscriptos
    );
    let contadorInscriptosPartido = partido.value.contadorInscriptos;
    console.log(contadorInscriptosPartido.length);
    if (partido.value.contadorInscriptos.includes(userLog)) {
      console.log("El usuario ya está inscrito en este partido.");
      return; // Salir de la función si ya está inscrito
    } else {
      contadorInscriptosPartido.push(userLog);
    }
    console.log("los equipos se encuentran completos");
    actualizarListaInscriptos(partido.value.nombre, contadorInscriptosPartido);
  }
}

async function actualizarListaInscriptos(nombre, nuevaLista) {
  try {
    const partidosRef = collection(db, "partidos");
    const q = query(partidosRef, where("nombre", "==", nombre));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (partido) => {
      const partidoRef = doc(db, "partidos", partido.id);
      await updateDoc(partidoRef, {
        contadorInscriptos: nuevaLista,
      });
      console.log("lista actualizada correctamente");
      console.log(
        "usuarios inscriptos en partido:",
        partido.value
      );
    });
  } catch (error) {
    console.error("Error al actualizar contador de inscriptos:", error);
  }
}
</script>

<template>
  <LoadingContext :loading="loading">
    <section class="row p-1 m-0">
      <div class="col-12">
        <h2>Inscripcion a partido</h2>
        <h3 class="mb-3 fs-4 text-center">{{ partido.nombre }}</h3>
        <p>{{ partido.fecha }}</p>
        <p>{{ partido.totalJ }}</p>
        <ul>
          <li
            v-for="nombreJugador of partido.contadorInscriptos"
            :key="nombreJugador"
          >
            {{ nombreJugador }}
          </li>
        </ul>
        <button @click="InscriptionGame">Sumarme al partido</button>
      </div>
    </section>
  </LoadingContext>
</template>

<style scoped>
img {
  width: 80%;
}
</style>
