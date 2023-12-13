<script setup>
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../composition/useAuth';
    import { obtenerSeguidores, obtenerSiguiendo } from '../services/red';
    import Image from "../components/Image.vue";

    const { user } = useAuth();
    const userId = ref(null);
    const seguidores = ref([]);
    const siguiendo = ref([]);
    //console.log(user);

    onMounted(async () => {
        // Asegúrate de tener el ID del usuario actual disponible, probablemente obtenido al iniciar sesión.
        userId.value = user.value ? user.value.id : null;
        //console.log(userId);

        // Verifica que userId no sea null o undefined antes de realizar las consultas.
        if (userId.value) {
            try {
                seguidores.value = await obtenerSeguidores(userId.value);
                siguiendo.value = await obtenerSiguiendo(userId.value);
                console.log("Seguidores:", seguidores);
                console.log("Siguiendo:", siguiendo);
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
        <li v-for="seguidor in seguidores" :key="seguidor">
            <!-- <Image :src="seguidor.photoURL" class="rounded-circle foto-perfil" /> -->
            <p>{{ seguidor.nombre }} {{ seguidor.apellido }}</p>
        </li>
      </ul>
  
      <h2>Siguiendo</h2>
      <ul>
        <li v-for="seguido in siguiendo" :key="seguido">
            <p>{{ seguido.nombre }} {{ seguido.apellido }}</p>
        </li>
      </ul>
    </div>
</template>

<style scoped>
    .foto-perfil {
        width: 70%;
    }
</style>