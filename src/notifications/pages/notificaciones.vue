<template>
  <div>
    <h3>Notificaciones</h3>
    <ul v-if="notificaciones.length">
      <li v-for="notificacion in notificaciones" :key="notificacion.id">
        <p>{{ notificacion.mensaje }}</p>
        <!-- <small>{{ notificacion.fecha.toDate().toLocaleString() }}</small> -->
      </li>
    </ul>
    <p v-else>No tienes notificaciones</p>
  </div>
</template>

<script setup>
import { useNotificaciones } from "../composables/useNotifications";
import { useAuth } from "../../composition/useAuth";
import { agregarNotificacion } from "../services/notifications";
import { onMounted, ref, watchEffect } from "vue";

// Obtener usuario autenticado
const { user } = useAuth();
const notificaciones = ref([]); // Variable reactiva para almacenar las notificaciones

onMounted(() => {
  if (user.value && user.value.id) {
    const { notificaciones: notis } = useNotificaciones(user.value.id); // Extraer la referencia reactiva
    // Actualizar el contenido de notificaciones cuando cambie notis
    watchEffect(() => {
      notificaciones.value = notis.value; // Esto actualiza el array, no la referencia
    });
  }
});

// Ver los cambios en las notificaciones
watchEffect(() => {
  console.log("Notificaciones actualizadas:", notificaciones.value);
});
</script>

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
