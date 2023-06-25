<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getPartidos } from "../services/partidos";
import { ref, onMounted } from "vue";

const auth = getAuth();

// Crea una referencia reactiva a `partidos`
const partidos = ref([]);

// Observa los cambios de autenticación
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

  // Filtrar los partidos por ID del creador coincidente con el ID del usuario autenticado
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
            src="../assets/img/arrows-right.png"
            alt="Icono flechas dobles"
            class="icono-h2"
          />
        </router-link>
      </div>
    </div>
    <template v-if="partidos.length > 0">
      <div class="row px-3">
        <div class="card p-3" v-for="partido in partidos" :key="partido.id">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-10">
                <p class="card-title h3 text-start">{{ partido.nombre }}</p>
              </div>
              <div class="col-2 d-flex justify-content-end">
                <img
                  src="../assets/img/arrows-right.png"
                  alt="Icono flechas dobles"
                  class="icono-h2"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-2 d-flex justify-content-start">
                <img
                  src="../assets/img/reloj.png"
                  alt="Icono flechas dobles"
                  class="icono-h2"
                />
              </div>
              <div class="col-10 d-flex align-items-end">
                <p class="card-subtitle h6 text-body-secondary text-start">
                  {{ partido.fecha }} {{ partido.hora }}
                </p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-2 d-flex justify-content-start">
                <img
                  src="../assets/img/alfiler.png"
                  alt="Icono flechas dobles"
                  class="icono-h2"
                />
              </div>
              <div class="col-10 d-flex align-items-end">
                <p class="card-subtitle h6 text-body-secondary text-start">
                  {{ partido.complejo }}
                </p>
              </div>
            </div>

            <div class="row justify-content-around">
              <div class="col-6 fondo-boton-card-negro rounded">
                <a href="#" class="text-white">Ver más</a>
              </div>
              <div class="col-6 fondo-boton-card rounded">
                <a href="#" class="text-white">Inscribirme</a>
              </div>
            </div>
          </div>
        </div>
      </div>
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

.foto-perfil {
  width: 100%;
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
