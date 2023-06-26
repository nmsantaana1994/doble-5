<script setup>
import Image from "../components/Image.vue";
import { useAuth } from "../composition/useAuth.js";
import ButtonHome from "../components/ButtonHome.vue";
import { getPartidos } from "../services/partidos";
import { ref, onMounted } from "vue";

const { user } = useHome();

function useHome() {
  const { user } = useAuth();

  return {
    user,
  };
}

async function getPartidosFromService(){
    const partidos = await getPartidos();
    console.log(partidos);
    return partidos;
}

const partidos = ref([]);

onMounted(async () => {
  partidos.value = await getPartidosFromService();
});
</script>

<template>
  <section class="p-3">
    <div class="row align-items-center">
      <div class="col-8">
        <h1 class="text-start h3">Home</h1>
      </div>
      <div class="col-4 d-flex justify-content-end">
        <img
          src="../assets/img/lupa.png"
          alt="Icono flechas dobles"
          class="icono-h2"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
      </div>
      <div class="col-8 d-flex align-items-center">
        <p class="text-start h3">
          {{ user.displayName ? user.displayName : user.nombre }} <br /><span
            class="h4 bienvenida"
            >¡Bienvenido!</span
          >
        </p>
      </div>
    </div>
  </section>

  <section class="px-3 pb-3">
    <div class="row d-flex justify-content-between">
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/home'">
          <img
            src="../assets/img/hogar.png"
            alt="Icono home"
            class="icono-card m-auto"
          />
          <p class="m-0">Home</p>
        </router-link>
        <!-- <ButtonHome route="Home" icon="hogar.png" /> -->
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/feed'">
          <img
            src="../assets/img/red-social.png"
            alt="Icono feed"
            class="icono-card m-auto"
          />
          <p class="m-0">Feed</p>
        </router-link>
        <!-- <ButtonHome route="Feed" icon="red-social.png" /> -->
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/partidos'">
          <img
            src="../assets/img/pelota.png"
            alt="Icono pelota"
            class="icono-card m-auto"
          />
          <p class="m-0">Partidos</p>
        </router-link>
        <!-- <ButtonHome route="Partidos" icon="pelota.png" />> -->
      </div>
      <div class="col-3 m-auto justify-content-center botonera-home">
        <router-link :to="'/red'">
          <img
            src="../assets/img/usuarios.png"
            alt="Icono red"
            class="icono-card m-auto"
          />
          <p class="m-0">Red</p>
        </router-link>
        <!-- <ButtonHome route="Red" icon="usuarios.png" /> -->
      </div>
    </div>
  </section>

  <section class="px-3 pb-3 my-5">
    <div class="row mb-3">
      <div class="col-10">
        <h2 class="text-start h3">
          <span class="text-decoration-underline">Próximos</span> partidos
        </h2>
      </div>
      <div class="col-2">
        <router-link to="/partidos">
          <img
            src="../assets/img/arrows-right.png"
            alt="Icono flechas dobles"
            class="icono-h2"
          />
        </router-link>
      </div>
    </div>
    <template v-if="partidos.length > 0">
        <div class="row px-3">
          <div class="card p-3 mb-3" v-for="partido in partidos" :key="partido.id">
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-10">
                  <p class="card-title h3 text-start">{{ partido.nombre }}</p>
                </div>
                <div class="col-2 d-flex justify-content-end">
                  <img
                    src="../assets/img/arrows-right.png"
                    alt="Icono flechas dobles"
                    class="icono-h2"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-2 d-flex justify-content-start">
                  <img
                    src="../assets/img/reloj.png"
                    alt="Icono flechas dobles"
                    class="icono-h2"
                  />
                </div>
                <div class="col-10 d-flex align-items-end">
                  <p class="card-subtitle h6 text-body-secondary text-start">
                    {{partido.fecha}} {{partido.hora}}
                  </p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-2 d-flex justify-content-start">
                  <img
                    src="../assets/img/alfiler.png"
                    alt="Icono flechas dobles"
                    class="icono-h2"
                  />
                </div>
                <div class="col-10 d-flex align-items-end">
                  <p class="card-subtitle h6 text-body-secondary text-start">
                    {{ partido.complejo }}
                  </p>
                </div>
              </div>
    
              <div class="row justify-content-around">
                <div class="col-6 fondo-boton-card-negro rounded">
                  <router-link :to="`/info-partido/${partido.nombre}`" class="text-white">Ver más</router-link>
                </div>
                <div class="col-6 fondo-boton-card rounded">
                  <a href="#" class="text-white">Inscribirme</a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </template>

    <template v-else>
        <div class="row px-3">
            <div class="col-12">
                <p>No hay partidos para mostrar</p>
            </div>
        </div>
    </template>
  </section>
</template>

<style scoped>
.icono-h2 {
  width: 25px;
  height: 25px;
}

.foto-perfil {
  width: 100%;
}

.bienvenida {
  color: #5d880d;
}

.botonera-home {
  width: 4.5rem;
  height: 4.5rem;
  background-color: #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.icono-card {
  width: 55%;
}

a {
  text-decoration: none;
  color: black;
}

.card-body {
  padding: 0;
}

.fondo-boton-card {
  background-color: #5d880d;
  width: 45%;
}

.fondo-boton-card-negro {
  background-color: #000000;
  width: 45%;
}
</style>
