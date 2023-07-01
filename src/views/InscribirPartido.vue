<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getPartidos } from "../services/partidos";
import { ref, onMounted } from "vue";

const auth = getAuth();

const partidos = ref([]);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    getPartidosForUser(uid);
  } else {
    console.log("Usuario no autenticado");
  }
});

async function getPartidosForUser(UsuarioId) {
  const partidosData = await getPartidos();
  console.log(partidosData);


  const filteredPartidos = partidosData.filter(
    (partido) => partido.userId === UsuarioId
  );

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
<h1>Inscripcion a partido</h1>
</template>

<style scoped>
</style>