<script setup>
import { agregarValoracion } from "../../services/users";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAuth } from "../../composition/useAuth";
import { notificationProvider } from "../../symbols/symbols";

const { setFeedbackMessage } = inject(notificationProvider);
const route = useRoute();
const router = useRouter();
const jugadorValoradoId = route.params.id;
const { user } = useAuth();

const estrellasSeleccionadas = ref(0);
const comentario = ref("");

function seleccionarEstrellas(n) {
  estrellasSeleccionadas.value = n;
}

onMounted(() => {
  console.log(user.id);
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
  };
  try {
    await agregarValoracion(jugadorValoradoId, valoracion);
    estrellasSeleccionadas.value = 0;
    comentario.value = "";
    setFeedbackMessage({
      type: "success",
      message: "Valoracion enviada correctamente.",
    });

    router.back();
  } catch (error) {
    alert("Ocurrió un error al enviar la valoración.");
  }
}
</script>

<template>
  <div class="valoracion-container">
    <h2 class="mb-3">Dejar una valoración</h2>

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
    <button class="btn btn-primary w-100" @click="enviarValoracion">
      Enviar valoración
    </button>
  </div>
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
</style>
