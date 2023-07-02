<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { cargarPartido } from "../services/partidos";

const auth = getAuth();
const contadorInscriptos = ref([]);

const route = useRoute();
const { partido, loading } = usePartido(route.params.nombre);

function InscriptionGame() {
  partido.totalJ = partido.cantidadJ * 2;
  console.log("total de jugadores: ", partido.totalJ);
  console.log("Inscribiéndome al partido...");
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    contadorInscriptos.value.push(uid); // Agrega el ID del usuario al array contadorInscriptos
    updateFirestore(uid); // Actualiza Firestore con el usuario inscrito
  }
}

// Función para actualizar Firestore con los usuarios inscritos
async function updateFirestore(uid) {
  try {
    const partidoRef = doc(db, "partidos", partido.id);
    await updateDoc(partidoRef, {
      inscriptos: contadorInscriptos.value,
    });
    console.log("Firestore actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar Firestore:", error);
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
          <li v-for="jugadorId of contadorInscriptos" :key="jugadorId">
            {{ jugadorId }}
          </li>
        </ul>
        <button @click="InscriptionGame">Sumarme al partido</button>
      </div>
    </section>
  </LoadingContext>
</template>

<style scoped></style>
