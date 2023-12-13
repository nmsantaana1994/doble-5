<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../composition/useAuth";
import { obtenerSeguidores, obtenerSiguiendo } from "../services/red";
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
            console.log("Usuario:", user);
        } catch (error) {
            console.error("Error al obtener seguidores y siguiendo:", error);
        }
    } else {
        console.warn("ID de usuario no disponible.");
    }
});
</script>

<template>
    <section class="p-3">
        <div class="row">
            <div class="col-12">
                <h2>Seguidores</h2>
                <ul class="list-unstyled">
                    <li v-for="seguidor in seguidores" :key="seguidor" class="row">
                        <div class="col-3">
                            <Image
                                :src="seguidor.photoURL"
                                class="rounded-circle foto-perfil"
                            />
                        </div>
                        <div class="col-9 d-flex align-items-center">
                            <p class="m-0">{{ seguidor.nombre }} {{ seguidor.apellido }}</p>
                        </div>
                    </li>
                </ul>
            </div>
    
            <div class="col-12">
                <h2>Siguiendo</h2>
                <ul class="list-unstyled">
                    <li v-for="seguido in siguiendo" :key="seguido" class="row">
                        <div class="col-3">
                            <Image
                                :src="seguido.photoURL"
                                class="rounded-circle foto-perfil"
                            />
                        </div>
                        <div class="col-9 d-flex align-items-center">
                            <p class="m-0">{{ seguido.nombre }} {{ seguido.apellido }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style scoped>
.foto-perfil {
    width: 70%;
}
</style>
