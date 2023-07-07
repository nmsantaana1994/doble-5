<script setup>
    import { useRoute } from "vue-router";
    import { usePartido } from "../composition/usePartidos";
    import LoadingContext from "../components/LoadingContext.vue";

    const route = useRoute();
    const {partido, loading} = usePartido(route.params.nombre);
    
</script>

<template>
<LoadingContext :loading="loading">
        <section class="row p-1 m-0">
            <div class="col-12">
                <h2 class="mb-3 fs-4 text-center"> {{ partido.nombre }}</h2>
                <p>{{partido.fecha}}</p>
            </div>
        </section>
    </LoadingContext>
</template>
