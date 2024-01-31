<script setup>
    import { useRoute } from "vue-router";
    import { usePartido } from "../composition/usePartidos";
    import { useUser } from "../composition/useUser"
    import LoadingContext from "../components/LoadingContext.vue";
    import { ref, onMounted } from "vue";

    const route = useRoute();
    const {partido, loading} = usePartido(route.params.id);
    const {user} = useUser(partido.userId);
    onMounted( () => {
        console.log("params",route.params)
    });
</script>

<template>
    <LoadingContext :loading="loading">
        <!-- <section class="row py-3 m-0">
            <div class="col-3 d-flex justify-content-center align-items-center">
            <router-link :to="`/partidos`">
                <img src="../assets/img/flecha-izquierda.png" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
            </div>
            <div class="col-9 d-flex align-items-center">
                <h1 class="text-center">En construcción</h1>
            </div>
        </section> -->
        <section class="row p-1 m-0">
            <div class="col-12">
                <img src="../assets/img/cancha-map.png" alt="Mapa de ubicación de la cancha" class="mb-3">
            </div>
            <div class="col-12">
                <h2 class="mb-3 fs-4">{{ partido.complejo }}</h2>
                <h2 class="mb-3 fs-4">{{ partido.id }}</h2>
            </div>
            <div class="col-12">
                <p class="mb-3 fs-5 text-center"> {{ partido.nombre }}</p>
                <p>{{ user }}</p>
                <p>{{partido.fecha}}</p>
            </div>
        </section>
    </LoadingContext>
</template>

<style scoped>
    img {
        width: 80%;
    }
</style>
