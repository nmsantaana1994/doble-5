<script setup>
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../composition/useAuth';
    import { obtenerSeguidores, obtenerSiguiendo } from '../services/red';

    const { user } = useAuth();
    const userId = ref(null);
    const seguidores = ref([]);
    const siguiendo = ref([]);
    console.log(user);

    onMounted(async () => {
        // Asegúrate de tener el ID del usuario actual disponible, probablemente obtenido al iniciar sesión.
        userId.value = user.value ? user.value.id : null;
        console.log(userId);

        // Verifica que userId no sea null o undefined antes de realizar las consultas.
        if (userId.value) {
            try {
                seguidores.value = await obtenerSeguidores(userId.value);
                siguiendo.value = await obtenerSiguiendo(userId.value);
            } catch (error) {
                console.error("Error al obtener seguidores y siguiendo:", error);
            }
        } else {
            console.warn("ID de usuario no disponible.");
        }
    });
</script>

<template>
    <div>
      <h2>Seguidores</h2>
      <ul>
        <li v-for="seguidor in seguidores" :key="seguidor">{{ seguidor }}</li>
      </ul>
  
      <h2>Siguiendo</h2>
      <ul>
        <li v-for="seguido in siguiendo" :key="seguido">{{ seguido }}</li>
      </ul>
    </div>
</template>