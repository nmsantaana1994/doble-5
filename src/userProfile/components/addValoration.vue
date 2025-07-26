<script setup>
import { agregarValoracion } from "../../services/users";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAuth } from "../../composition/useAuth";
import { notificationProvider } from "../../symbols/symbols";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
import { getUserById } from "../../services/users";
import Loading from "../../components/Loading.vue";
const { setFeedbackMessage } = inject(notificationProvider);
const route = useRoute();
const router = useRouter();
const jugadorValoradoId = route.params.id;
const { user } = useAuth();
const profile = ref(null);
const estrellasSeleccionadas = ref(0);
const comentario = ref("");
const loading = ref(false);

function seleccionarEstrellas(n) {
  estrellasSeleccionadas.value = n;
}

onMounted(async () => {
  try {
    loading.value = true;
    profile.value = await getUserById(jugadorValoradoId);
    console.log(user.id);
    loading.value = false;
  } catch {
    loading.value = false;
  }
});

async function enviarValoracion() {
  if (estrellasSeleccionadas.value === 0 || comentario.value.trim() === "") {
    alert("Debes elegir una cantidad de estrellas y escribir un comentario.");
    return;
  }

  const valoracion = {
    estrellas: estrellasSeleccionadas.value,
    comentario: comentario.value.trim(),
    fecha: new Date().toISOString(),
    autorId: user.value.id,
    autorName: user.value.displayName || user.value.nombre,
  };
  try {
    await agregarValoracion(jugadorValoradoId, valoracion);
    estrellasSeleccionadas.value = 0;
    comentario.value = "";
    setFeedbackMessage({
      type: "success",
      message: "Valoración enviada correctamente.",
    });

    router.back();
  } catch (error) {
    alert("Ocurrió un error al enviar la valoración.");
  }
}
</script>

<template>
  <HeaderPage
    route="/home"
    :title="
      user ? 'Valorá a ' + profile?.displayName || profile?.nombre : 'perfil'
    "
    v-if="!loading"
  ></HeaderPage>
  <Loading :loading="loading" />
  <Section>
    <!-- Estrellas -->
    <div class="estrellas mb-3">
      <span
        v-for="n in 5"
        :key="n"
        :class="{ activa: n <= estrellasSeleccionadas }"
        @click="seleccionarEstrellas(n)"
        >★</span
      >
    </div>

    <!-- Comentario -->
    <textarea
      v-model="comentario"
      rows="4"
      class="form-control mb-3"
      placeholder="Escribí un comentario sobre el jugador..."
    ></textarea>

    <!-- Botón -->
    <button class="button_send" @click="enviarValoracion">
      ENVIAR VALORACIÓN
    </button>
  </Section>
</template>

<style scoped>
.valoracion-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fafafa;
}

.estrellas span {
  font-size: 30px;
  cursor: pointer;
  color: lightgray;
  transition: 0.2s;
}

.estrellas span.activa {
  color: gold;
}

.button_send {
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem;
  width: 100%;
  font-weight: 600;
}
</style>
