<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../composition/useAuth";
import { obtenerSeguidores, obtenerSiguiendo } from "../services/red";
import Image from "../components/Image.vue";
import Loader from "../components/Loader.vue";
import HeaderPage from "../components/HeaderPage.vue";
import Loading from "../components/Loading.vue";
import Section from "../components/Section.vue";
const { user, seguidores, siguiendo, loading } = useRed();

function useRed() {
    const { user } = useAuth();
    const userId = ref(null);
    const seguidores = ref([]);
    const siguiendo = ref([]);
    const loading = ref(false);
    //console.log(user);

    onMounted(async () => {
        // Asegúrate de tener el ID del usuario actual disponible, probablemente obtenido al iniciar sesión.
        userId.value = user.value ? user.value.id : null;
        //console.log(userId);

        // Verifica que userId no sea null o undefined antes de realizar las consultas.
        if (userId.value) {
            try {
                loading.value = true;

                seguidores.value = await obtenerSeguidores(userId.value);
                siguiendo.value = await obtenerSiguiendo(userId.value);

                loading.value = false;
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

    return {
        user,
        seguidores,
        siguiendo,
        loading,
    }
}

</script>

<template>
    <HeaderPage route="/home" title="Red" />
    <Loading :loading="loading" />
    <Section>
        <div class="row">
            <ul class="nav nav-tabs nav-fill mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="seguidores-tab" data-bs-toggle="tab"
                        data-bs-target="#seguidores-tab-pane" type="button" role="tab"
                        aria-controls="seguidores-tab-pane" aria-selected="true">Seguidores</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="siguiendo-tab" data-bs-toggle="tab"
                        data-bs-target="#siguiendo-tab-pane" type="button" role="tab" aria-controls="siguiendo-tab-pane"
                        aria-selected="false">Siguiendo</button>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" id="seguidores-tab-pane" role="tabpanel"
                    aria-labelledby="seguidores-tab" tabindex="0">
                    <ul class="list-unstyled">
                        <li v-for="seguidor in seguidores" :key="seguidor" class="row">
                            <div class="col-3">
                                <Image :src="seguidor.photoURL" />
                            </div>
                            <div class="col-9 d-flex align-items-center">
                                <p class="m-0">{{ seguidor.nombre }} {{ seguidor.apellido }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tab-pane fade show" id="siguiendo-tab-pane" role="tabpanel" aria-labelledby="siguiendo-tab"
                    tabindex="0">
                    <ul class="list-unstyled">
                        <li v-for="seguido in siguiendo" :key="seguido" class="row">
                            <div class="col-3">
                                <Image :src="seguido.photoURL"  />
                            </div>
                            <div class="col-9 d-flex align-items-center">
                                <p class="m-0">{{ seguido.nombre }} {{ seguido.apellido }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Section>
    <!-- <section class="p-3" style="margin: 50px 0 50px 0;"> -->


    <!-- <hr>

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
            </div> -->
    <!-- </div>
    </section> -->
</template>

<style scoped>
.foto-perfil {
    width: 70%;
}
</style>
