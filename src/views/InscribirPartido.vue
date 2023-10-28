<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../composition/usePartidos";
import LoadingContext from "../components/LoadingContext.vue";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const route = useRoute();
const { partido, loading } = usePartido(route.params.nombre);

async function obtenerNombreDocumentoPorAlgunaCondicion() {
  const collectionRef = collection(db, "partidos");

  try {
    const querySnapshot = await getDocs(collectionRef);
    const nombresDocumentos = querySnapshot.docs.map((doc) => doc.id);
    console.log('querySnapshot',querySnapshot)
    console.log('nombresDocumentos',nombresDocumentos)
    return nombresDocumentos;
  } catch (error) {
    console.error("Error al obtener nombres de documentos:", error);
    return [];
  }
}

function mostrarInfoPartidoEUsuario() {
  const user = auth.currentUser;
  let uid = null;
  if(user){
    uid = user.uid;
    console.log("USER ID: ", uid)
  }
  partido.value.contadorInscriptos.push(uid);
  console.log("partido", partido);
  console.log("user", user);
  console.log("user name", user.displayName);
  console.log("usuarios inscriptos", partido.value.contadorInscriptos);
  obtenerNombreDocumentoPorAlgunaCondicion();
  updateDocument(partido.value.contadorInscriptos,); // Actualiza Firestore con el nuevo array
}

async function updateDocument (arrayPartidos, ) {
  const partidoRef = doc(db, "partidos", );
  
  await updateDoc(partidoRef, {
    contadorInscriptos: arrayPartidos
  });
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
          <li v-for="jugadorId of partido.contadorInscriptos" :key="jugadorId">
            {{ jugadorId.displayName }}
          </li>
        </ul>
        <button @click="mostrarInfoPartidoEUsuario">Sumarme al partido</button>
      </div>
    </section>
  </LoadingContext>
</template>

<style scoped></style>
