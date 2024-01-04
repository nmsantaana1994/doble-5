<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getPartidoByNombre } from "../services/partidos";
import { collection, query, where, getDocs } from "firebase/firestore";


const auth = getAuth();
const db = getFirestore();
const contadorInscriptos = ref([]);

const route = useRoute();
const { partido, loading } = usePartido(route.params.nombre);

function InscriptionGame() {
  partido.totalJ = partido.cantidadJ * 2;
  console.log("total de jugadores: ", partido.totalJ);
  console.log("Inscribiéndome al partido...");
  const user = auth.currentUser;
  if (user) {
    const uidName = user.displayName;
  console.log("user",user)
    contadorInscriptos.value.push(uidName); // Agrega el ID del usuario al array contadorInscriptos
    // console.log(partido.value.nombre)
    // updateFirestore(contadorInscriptos.value); // Actualiza Firestore con el nuevo array
    actualizarContadorInscriptosPorNombre(partido.value.nombre,contadorInscriptos.value);
  }
}

// async function updateFirestore(inscriptos) {
//   try {

//     const partidoRef = doc(db, "partidos", partido.value.nombre); // Utiliza partido.id en lugar de uid
//     await updateDoc(partidoRef, {
//       inscriptos: inscriptos, // Actualiza la propiedad "inscriptos" en Firestore
//     });
//     console.log("Firestore actualizado correctamente");
//   } catch (error) {
//     console.error("Error al actualizar Firestore:", error);
//   }
// }
// import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

async function actualizarContadorInscriptosPorNombre(nombre, nuevoContador) {
  try {
    const partidosRef = collection(db, "partidos");
    const q = query(partidosRef, where("nombre", "==", nombre));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (partido) => {
      const partidoRef = doc(db, "partidos", partido.id);

      await updateDoc(partidoRef, {
        contadorInscriptos: nuevoContador,
      });

      console.log("Contador de inscriptos actualizado correctamente");
    });
  } catch (error) {
    console.error("Error al actualizar contador de inscriptos:", error);
  }
}



</script>

<template>
  <LoadingContext :loading="loading">
    <section class="row py-3 m-0">
            <div class="col-3 d-flex justify-content-center align-items-center">
            <router-link :to="`/home`">
                <img src="../assets/img/flecha-izquierda.png" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
            </div>
            <div class="col-9 d-flex align-items-center">
                <h1 class="text-center">En construcción <!--Información--></h1>
            </div>
    </section>
    <!-- <section class="row p-1 m-0">
      <div class="col-12">
        <h2>Inscripcion a partido</h2>
        <h3 class="mb-3 fs-4 text-center">{{ partido.nombre }}</h3>
        <p>{{ partido.fecha }}</p>
        <p>{{ partido.totalJ }}</p>
        <ul>
          <li v-for="nombreJugador of contadorInscriptos" :key="nombreJugador">
            {{ nombreJugador }}
          </li>
        </ul>
        <button @click="InscriptionGame">Sumarme al partido</button>
      </div>
    </section> -->
  </LoadingContext>
</template>

<style scoped>
  img {
    width: 80%;
  }
</style>
