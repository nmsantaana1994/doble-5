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
// async function obtenerNombreDocumentoPorAlgunaCondicion() {
//   const collectionRef = collection(db, "coleccion");

//   try {
//     const querySnapshot = await getDocs(collectionRef);
//     const nombresDocumentos = querySnapshot.docs.map((doc) => doc.id);
//     console.log('querySnapshot',querySnapshot)
//     console.log('nombresDocumentos',nombresDocumentos)
//     return nombresDocumentos;
//   } catch (error) {
//     console.error("Error al obtener nombres de documentos:", error);
//     return [];
//   }
// }

// async function actualizarDocumento(nombreDocumento, datosActualizados) {
//   const db = getFirestore();
//   const docRef = doc(db, "coleccion", nombreDocumento);

//   try {
//     await updateDoc(docRef, datosActualizados);
//     console.log("Documento actualizado correctamente");
//   } catch (error) {
//     console.error("Error al actualizar documento:", error);
//   }
// }

// // Uso de las funciones
// async function main() {
//   const nombresDocumentos = await obtenerNombreDocumentoPorAlgunaCondicion();
//   if (nombresDocumentos.length > 0) {
//     const nombreDocumento = nombresDocumentos[0]; // Por ejemplo, obtenemos el primer nombre de documento
//     const datosActualizados = {
//       // Aquí colocas los datos actualizados que deseas guardar en el documento
//       campo1: "nuevo valor",
//       campo2: 42,
//       // ...
//     };
//     await actualizarDocumento(nombreDocumento, datosActualizados);
//   } else {
//     console.log("No se encontraron documentos en la colección.");
//   }
// }

// main();

// async function updateFirestore(inscriptos,uid) {
//   try {
//     const partidoRef = doc(db, "partidos", uid);
//     console.log('partido nombre: ',partido.value.nombre)
//     console.log('referencia ID partido: ',uid)
//     console.log('INSCRIPTOS: ',inscriptos)
//     await updateDoc(partidoRef, {
//       contadorInscriptos: inscriptos,
//     });
//     console.log("Firestore actualizado correctamente");
//   } catch (error) {
//     console.error("Error al actualizar Firestore:", error);
//   }
// }
// // function InscriptionGame() {
// //   console.log("partido: ", partido);
// //   console.log("total de jugadores: ", partido.value.cantidadJ);
// //   console.log("Inscribiéndome al partido...");
// //   const user = auth.currentUser;
// //   if (user) {
// //     const uid = user.uid; // Obtén el ID de usuario específico
// //     console.log(uid);
// //     if (partido.value.contadorInscriptos.includes(user)) {
// //       console.log("Ya se encuentra cargado en el sistema");
// //     } else {
// //       partido.value.contadorInscriptos.push(user);
// //       updateFirestore(partido.value.contadorInscriptos); // Actualiza Firestore con el nuevo array
// //     }
// //     console.log("Contador jugadores inscriptos", partido.value.contadorInscriptos);
// //   }
// // }

// //   async function updateFirestore(inscriptos) {
// //     try {
// //       const partidoRef = doc(db, "partidos", partido.value.nombre);
// //       console.log('partido nombre: ',partido.value.nombre)
// //       console.log('PARTIDO REF: ',partidoRef)
// //       console.log('INSCRIPTOS: ',inscriptos)
// //       await updateDoc(partidoRef, {
// //         contadorInscriptos: inscriptos,
// //       });
// //       console.log("Firestore actualizado correctamente");
// //     } catch (error) {
// //       console.error("Error al actualizar Firestore:", error);
// //     }
// //   }
// function InscriptionGame() {
//   console.log("partido: ", partido.value.nombre);
//   console.log("total de jugadores: ", partido.value.cantidadJ);
//   console.log("Inscribiéndome al partido...");
//   const user = auth.currentUser;
//   if (user) {
//     // const uid = user.uid; // Obtén el ID de usuario específico
//     console.log(user);
//     if (partido.value.contadorInscriptos.includes(user)) {
//       console.log("Ya se encuentra cargado en el sistema");
//     } else {
//       partido.value.contadorInscriptos.push(user); // Agrega el ID del usuario al array contadorInscriptos
//       updateFirestore(partido.value.contadorInscriptos); // Actualiza Firestore con el nuevo array de IDs de usuario
//     }
//     console.log("Contador jugadores inscriptos", partido.value.contadorInscriptos);
//   }
// }

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
