<script setup>
    import { useRoute } from "vue-router";
    import { usePartido } from "../composition/usePartidos";
    import { useUser } from "../composition/useUser"
    import LoadingContext from "../components/LoadingContext.vue";

    const route = useRoute();
    const {partido, loading} = usePartido(route.params.nombre);
    const {user} = useUser(partido.userId);
</script>

<template>
<LoadingContext :loading="loading">
        <section class="row p-1 m-0">
            <h1 class="text-center">Información</h1>
            <div class="col-12">
                <img src="../assets/img/cancha-map.png" alt="Mapa de ubicación de la cancha" class="mb-3">
            </div>
            <div class="col-12">
                <h2 class="mb-3 fs-4">{{partido.complejo}}</h2>
            </div>
            <div class="col-12">
                <p class="mb-3 fs-5 text-center"> {{ partido.nombre }}</p>
                <p>{{ user }}</p>
                <p>{{partido.fecha}}</p>
            </div>
        </section>
    </LoadingContext>
</template>
