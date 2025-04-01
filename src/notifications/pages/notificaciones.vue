<template>
  <div>
    <HeaderPage route="/home" title="Notificaciones" />
    <Section>
      <h3>Notificaciones</h3>
      <ul v-if="notificaciones.length > 0">
        <li
          v-for="notificacion in notificaciones"
          :key="notificacion.id"
          :class="{ 'notificacion-leida': notificacion.leida }"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div @click="marcarComoLeida(notificacion)">
              <p>{{ notificacion.mensaje }}</p>
              <small>{{ notificacion.created_at?.toDate().toLocaleString() }}</small>
            </div>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="eliminarNotificacionHandler(notificacion.id)"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
      <p v-else>No tienes notificaciones</p>
    </Section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "../../composition/useAuth";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
import {
  obtenerNotificaciones,
  marcarNotificacionComoLeida,
  eliminarNotificacion,
} from "../services/notifications";

// Obtener usuario autenticado
const { user } = useAuth();
const notificaciones = ref([]); // Variable reactiva para almacenar las notificaciones
let unsubscribe = null;

onMounted(() => {
  if (user.value && user.value.id) {
    console.log("Cargando notificaciones para el usuario:", user.value.id);
    unsubscribe = obtenerNotificaciones(user.value.id, (nuevasNotificaciones) => {
      console.log("Notificaciones actualizadas en el componente:", nuevasNotificaciones); // Depuración
      notificaciones.value = nuevasNotificaciones; // Actualizar en tiempo real
    });
  } else {
    console.error("El usuario no está autenticado o no tiene un ID válido.");
  }
});

// Usar watchEffect para observar cambios en las notificaciones
// watchEffect(() => {
//   console.log("Notificaciones actualizadas (watchEffect):", notificaciones.value);
// });

// Función para marcar una notificación como leída
const marcarComoLeida = async (notificacion) => {
  if (!notificacion.leida) {
    await marcarNotificacionComoLeida(notificacion.id);
    notificacion.leida = true; // Actualizar localmente
  }
};

// Función para eliminar una notificación
const eliminarNotificacionHandler = async (notificacionId) => {
  try {
    await eliminarNotificacion(notificacionId);
    notificaciones.value = notificaciones.value.filter(
      (notificacion) => notificacion.id !== notificacionId
    );
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
  }
};

// Limpiar el listener al desmontar el componente
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.notificacion-leida {
  opacity: 0.6;
}
</style>
<!-- 
<template>
  <div>
    <h3>Notificaciones</h3>
    <ul v-if="notificaciones.length">
      <li v-for="notificacion in notificaciones" :key="notificacion.id">
        <p>{{ notificacion.mensaje }}</p>
        <small>{{ notificacion.fecha.toDate().toLocaleString() }}</small>
      </li>
    </ul>
    <p v-else>No tienes notificaciones</p>
  </div>
</template>

<script setup>
import { useNotificaciones } from "../composables/useNotifications";
import { useAuth } from "../../composition/useAuth";
import { agregarNotificacion } from "../services/notifications";
import { ref, onMounted } from "vue";

// Obtener usuario autenticado
const { user } = useAuth();
const notificaciones = ref([]);

onMounted(async () => {
  // Asegurarte de que el usuario esté disponible antes de llamar a `useNotificaciones`
  if (user.value && user.value.id) {
    const { notificaciones: notis } = useNotificaciones(user.value.id);
    notificaciones.value = notis;

    // await agregarNotificacion("chau", user.value.id);
  } else {
    console.log("El usuario no está disponible.");
  }
});
</script> -->
