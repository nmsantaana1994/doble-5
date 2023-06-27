<script setup>
</script>

<template>
    <section class="row m-auto d-flex justify-content-center align-items-center vh-100 background-inicio">
        <div class="col-12 mt-5 d-flex justify-content-center">
            <img src="../assets/img/logo-original.png" alt="Logo Doble-5" class="ancho-logo"/>
        </div>
        <div class="row justify-content-around mt-5">
            <div class="col-6 boton-inicio d-flex justify-content-center px-6">
                <router-link to="/iniciar-sesion" class="text-white text-decoration-none fw-semibold">INICIAR SESIÓN</router-link>
            </div>
            <div class="col-6 boton-registro d-flex justify-content-center px-6">
                <router-link to="/registro" class="text-white text-decoration-none fw-semibold">REGISTRARME</router-link>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .ancho-logo {
        width: 80%;
    }

    .boton-inicio {
        background-color: #5d880d;
        width: 45%;
        padding: 10px;
        border-radius: 10px;
        margin-right: 1em;
    }

    .boton-registro {
        background-color: #000000;
        width: 45%;
        padding: 10px;
        border-radius: 10px;
        margin-left: 1em;
    }

    .background-inicio {
        background-image: url("../assets/img/background-inicio.jpg");
        width: 100%;
        background-size: cover;
        background-position: 75% 35%;
        background-repeat: no-repeat;
    }
</style>