<script setup>
</script>

<template>
    <section class="row m-auto d-flex justify-content-center align-items-center vh-100 background-inicio">
        <div class="col-12 mt-5 d-flex justify-content-center">
            <img src="../assets/img/logo-blanco.png" alt="Logo Doble-5" class="ancho-logo"/>
        </div>
        <div class="row justify-content-evenly mt-5">
            <div class="col-6 loader-container d-flex justify-content-center px-6">
                <div class="spinner-border" role="status">
                    <span class="sr-only"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .ancho-logo {
        width: 80%;
    }

    .boton-inicio {
        width: 45%; 
        height: 44px;
        padding: 10px;
        border-radius: 10px;

    }

    .boton-registro {
        width: 45%;
        height: 44px;
        padding: 10px;
        border-radius: 10px;

    }

    .background-inicio {
        background-image: url("../assets/img/background-inicio.jpg");
        width: 100%;
        background-size: cover;
        background-position: 75% 35%;
        background-repeat: no-repeat;
    }

    .loader-container {
    color: white;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
</style>