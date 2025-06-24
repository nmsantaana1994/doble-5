<script setup>
import Image from "../../components/Image.vue";
import Loader from "../../components/Loader.vue";
import router from "../../router/router";
import changePhoto from "../components/changePhoto.vue";
import { onMounted, watch, computed } from "vue";
import { ref } from "vue";

const flagChangePhoto = ref(false);

onMounted(() => {
  console.log(props.isMyProfile);
});

const jugadores = ref([]);

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  totalSeguidores: {
    type: Number,
    default: 0,
  },
  totalSiguiendo: {
    type: Number,
    default: 0,
  },
  seguirDejarSeguir: {
    type: Function,
    //required: true,
  },
  userFollowing: {
    type: Boolean,
    //required: true,
  },
  mostrarBoton: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
  },
  isMyProfile: {
    type: Boolean,
  },
});

function funcChangePhoto() {
  flagChangePhoto.value = !flagChangePhoto.value;
  console.log("cambiar foto");
}

function handlePhotoUpdated(success) {
  if (success) {
    console.log("Foto de perfil actualizada con éxito");
  } else {
    console.log("Error al actualizar la foto de perfil");
  }
  flagChangePhoto.value = false;
}
const promedioEstrellas = computed(() => {
  const valoraciones = props.user.valoraciones || [];

  if (valoraciones.length === 0) return 0;

  const suma = valoraciones.reduce((acc, v) => acc + v.estrellas, 0);
  return suma / valoraciones.length; // <- devolvemos número, no string
});
</script>

<template>
  <div class="row">
    <div class="col-12 mb-3">
      <div class="d-flex justify-content-center mb-3">
        <Image :src="user.photoURL" />
      </div>
      <div
        class="change_photo d-flex justify-content-center mb-3"
        @click="funcChangePhoto"
        v-if="props.isMyProfile"
      >
        <img src="../../assets/img/lapiz.png" alt="icono lapiz" />
        <button>Cambiar foto de perfil</button>
      </div>
      <changePhoto
        class="mb-3"
        v-if="flagChangePhoto"
        @photoUpdated="handlePhotoUpdated"
      />
      <p class="h2 text-center m-0">{{ user.nombre }} {{ user.apellido }}</p>
    </div>
    <div class="col-12 mb-3">
      <div class="row">
        <div class="col-6 mt-3">
          <router-link
          :to="`/red/`"
          class="text-decoration-none text-dark"
          >
            <!-- <Loader v-if="loading" /> -->
            <p class="text-center fw-bold">{{ totalSeguidores }}</p>
            <p class="text-center fw-bold">Seguidores</p>
          </router-link>
        </div>
        <div class="col-6 mt-3">
          <router-link
          :to="`/red/`"
          class="text-decoration-none text-dark"
          >
            <!-- <Loader v-if="loading" /> -->
            <p class="text-center fw-bold">{{ totalSiguiendo }}</p>
            <p class="text-center fw-bold">Siguiendo</p>
          </router-link>
        </div>
      </div>
      <!-- Mostrar botón de seguir/dejar de seguir -->
      <div class="d-grid gap-2" v-if="!props.isMyProfile">
        <!-- Botón para seguir o dejar de seguir -->
        <button
          v-if="mostrarBoton"
          @click="seguirDejarSeguir"
          class="btn btn-primary w-auto"
        >
          {{ userFollowing ? "Dejar de seguir" : "Seguir" }}
        </button>
      </div>
    </div>
    <div class="col-12 mt-3">
      <dl class="d-flex flex-column justify-content-center ps-3">
        <dt class="fw-light">NOMBRE DE USUARIO</dt>
        <dd class="mb-3 fw-bold">
          {{ user.displayName || "No especificado" }}
        </dd>
        <dt class="fw-light">NOMBRE</dt>
        <dd class="mb-3 fw-bold">{{ user.nombre || "No especificado" }}</dd>
        <dt class="fw-light">APELLIDO</dt>
        <dd class="mb-3 fw-bold">{{ user.apellido || "No especificado" }}</dd>
        <dt class="fw-light">EMAIL</dt>
        <dd class="mb-3 fw-bold">{{ user.email }}</dd>
        <dt class="fw-light">FECHA DE NACIMIENTO</dt>
        <dd class="mb-3 fw-bold">{{ user.nacimiento }}</dd>
        <dt class="fw-light">NIVEL DE JUEGO</dt>
        <p class="estrellas">
          <span
            v-for="n in 5"
            :key="n"
            :class="{ activa: n <= user.valoracion }"
            >★</span
          >
        </p>
        <p class="comentario">“{{ user.comentario || "No especificado" }}”</p>

        <div class="valoracion-general">
          <h5>Valoración de otros jugadores</h5>

          <div class="estrellas">
            <span
              v-for="n in 5"
              :key="n"
              class="estrella"
              :class="{ activa: n <= Math.round(promedioEstrellas) }"
              >★</span
            >
            <span class="promedio">({{ promedioEstrellas }}/5)</span>
          </div>

          <div class="comentarios mt-3" v-if="user.valoraciones?.length">
            <div
              v-for="(val, index) in user.valoraciones"
              :key="index"
              class="comentario"
            >
              <p class="fw-bold m-0">{{ val.nombreUsuario }}</p>
              <p class="mb-1 text-muted">
                <span
                  v-for="n in 5"
                  :key="n"
                  :class="{ activa: n <= val.estrellas }"
                  >★</span
                >
              </p>
              <p>"{{ val.comentario }}"</p>
              <hr />
            </div>
          </div>
          <p v-else class="text-muted">Aún no tiene valoraciones.</p>
        </div>
        <dt class="fw-light">GÉNERO</dt>
        <dd class="mb-3 fw-bold">{{ user.genero || "No especificado" }}</dd>
        <dt class="fw-light">BARRIO</dt>
        <dd class="mb-3 fw-bold">{{ user.barrio || "No especificado" }}</dd>
        <dt class="fw-light">TELÉFONO</dt>
        <dd class="mb-3 fw-bold">{{ user.telefono || "No especificado" }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.change_photo {
  display: flex;
  align-items: center;
  width: 50%;
  margin: auto;
}
.change_photo button {
  border: none;
  background-color: transparent;
  color: gray;
  padding-bottom: 0.2rem;
}
.change_photo button:hover {
  color: black;
}
.change_photo img {
  width: 20px;
  height: 20px;
}

.estrellas {
  color: gold;
  font-size: 22px;
  margin: 5px 0;
}

.estrellas span {
  color: lightgray; /* Por defecto, gris claro */
}

.estrellas span.activa {
  color: gold; /* Solo las activas son doradas */
}

.comentario {
  font-style: italic;
  color: #555;
}

.estrellas span {
  color: lightgray;
  font-size: 20px;
}
.estrellas span.activa {
  color: gold;
}
.promedio {
  margin-left: 0.5rem;
  color: #333;
  font-weight: bold;
}
.comentario {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
}
</style>
