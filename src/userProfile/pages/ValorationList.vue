<script setup>
import { useAuth } from "../../composition/useAuth.js";
import { ref, onMounted } from "vue";
import Loading from "../../components/Loading.vue";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import { useRoute } from "vue-router";
import { getUserById } from "../../services/users.js";

const { user } = useAuth();
const profile = ref(null);
const ruta = ref("");
const route = useRoute();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  const profileID = route.params.id;
  console.log("profileID:", profileID);

  if (!profileID) {
    console.warn("No se encontró un ID de perfil en la ruta.");
    return;
  }
  ruta.value = getRuta(profileID);
  profile.value = await getUserById(profileID);
  loading.value = false;
});

function getRuta(profileID) {
  if (user.value) {
    if (profileID == user.value.id) {
      return "/perfil";
    } else {
      return `/usuario/${profileID}`;
    }
  }
  return "/home";
}
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage :route="ruta" :title="'Valoraciones'" />
  <Section>
    <div class="col-12 go_valoration" v-if="profile">
      <router-link
        :to="`/usuario/${profile.id}/valoration`"
        class="text-blue-400 underline"
        >¿Queres dejar una valoracion a
        {{ profile.displayName ? profile.displayName : profile.nombre }}
        ?</router-link
      >
    </div>
    <template v-if="profile && profile.valoraciones?.length > 0">
      <div
        v-for="(valoracion, index) in profile.valoraciones"
        :key="index"
        class="card mb-3 p-3"
      >
        <div class="estrellas mb-2">
          <span
            v-for="n in 5"
            :key="n"
            class="estrella"
            :class="{ activa: n <= valoracion.estrellas }"
            >★</span
          >
          <span class="promedio">({{ valoracion.estrellas }}/5)</span>
        </div>
        <p>{{ valoracion.autorName }}</p>
        <p class="comentario mb-0">
          {{ valoracion.comentario || "Sin comentario" }}
        </p>
      </div>
    </template>
    <template v-else>
      <p>No hay valoraciones para mostrar.</p>
    </template>
  </Section>
</template>

<style scoped>
.estrellas {
  color: gold;
  font-size: 22px;
  margin: 5px 0;
}

.estrellas span {
  color: lightgray;
}

.estrellas span.activa {
  color: gold;
}

.comentario {
  font-style: italic;
  color: #555;
}
.go_valoration {
  margin: 1rem 0;
}
</style>
