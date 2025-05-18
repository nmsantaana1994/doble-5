<template>
  <div>
    <HeaderPage route="/home" title="Notificaciones" />
    <Section>
      <h3 class="mb-3">Notificaciones</h3>
      <div v-if="notificaciones.length > 0" class="notificaciones-list">
        <div
          v-for="notificacion in notificaciones"
          :key="notificacion.id"
          class="notificacion-card"
          :class="{ leida: notificacion.leida }"
          @click="irADetalle(notificacion)"
        >
          <div class="icono">
            <span v-if="notificacion.tipo === 'like'"><i class="bi bi-hand-thumbs-up"></i></span>
            <span v-else-if="notificacion.tipo === 'comentario'"><i class="bi bi-chat-left-dots"></i></span>
            <span v-else><i class="bi bi-bell"></i></span>
          </div>
          <div class="contenido">
            <p class="mensaje">{{ notificacion.mensaje }}</p>
            <small class="fecha">
              {{ notificacion.created_at?.toDate().toLocaleString() }}
            </small>
          </div>
          <div class="acciones">
            <button
              class="btn btn-link eliminar"
              @click.stop="eliminarNotificacionHandler(notificacion.id)"
              title="Eliminar notificación"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <p v-else>No tienes notificaciones</p>
    </Section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "../../composition/useAuth";
import { useRouter } from "vue-router";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
import {
  obtenerNotificaciones,
  marcarNotificacionComoLeida,
  eliminarNotificacion,
} from "../services/notifications";

const { user } = useAuth();
const notificaciones = ref([]);
const router = useRouter();
let unsubscribe = null;

onMounted(() => {
  if (user.value && user.value.id) {
    unsubscribe = obtenerNotificaciones(user.value.id, (nuevasNotificaciones) => {
      notificaciones.value = nuevasNotificaciones;
    });
  }
});

const irADetalle = async (notificacion) => {
  if (!notificacion.leida) {
    await marcarNotificacionComoLeida(notificacion.id);
    notificacion.leida = true;
  }

  if (notificacion.ruta) {
    router.push(notificacion.ruta);
  }
};

const eliminarNotificacionHandler = async (notificacionId) => {
  try {
    await eliminarNotificacion(notificacionId);
    notificaciones.value = notificaciones.value.filter(
      (n) => n.id !== notificacionId
    );
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
  }
};

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style scoped>
.notificaciones-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notificacion-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.notificacion-card:hover {
  background: #f9f9f9;
}

.notificacion-card.leida {
  opacity: 0.6;
}

.icono {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.contenido {
  flex: 1;
}

.mensaje {
  margin: 0;
  font-weight: 500;
}

.fecha {
  color: #666;
  font-size: 0.8rem;
}

.acciones {
  margin-left: 1rem;
}

.eliminar {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #dc3545;
  cursor: pointer;
}
</style>
