<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../composition/useAuth";
import { obtenerSeguidores, obtenerSiguiendo } from "../services/red";
import Image from "../components/Image.vue";
import Loader from "../components/Loader.vue";
import HeaderPage from "../components/HeaderPage.vue";
import Loading from "../components/Loading.vue";
import Section from "../components/Section.vue";
import router from "../router/router";
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
        <div class="row px-3">
            <ul class="nav nav-tabs nav-fill mb-5 mt-3 px-3" role="tablist">
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
                            <router-link :to="'/usuario/' + seguidor.id" class="col-12 mb-3 text-decoration-none text-dark">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="w-75">
                                            <Image :src="seguidor.photoURL" />
                                        </div>
                                    </div>
                                    <div class="col-9 d-flex align-items-center">
                                        <p class="m-0">{{ seguidor.nombre }} {{ seguidor.apellido }}</p>
                                    </div>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="tab-pane fade show" id="siguiendo-tab-pane" role="tabpanel" aria-labelledby="siguiendo-tab"
                    tabindex="0">
                    <ul class="list-unstyled">
                        <li v-for="seguido in siguiendo" :key="seguido" class="row">
                            <router-link :to="'/usuario/' + seguido.id" class="col-12 mb-3 text-decoration-none text-dark">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="w-75">
                                            <Image :src="seguido.photoURL"  />
                                        </div>
                                    </div>
                                    <div class="col-9 d-flex align-items-center">
                                        <p class="m-0">{{ seguido.nombre }} {{ seguido.apellido }}</p>
                                    </div>
                                </div>
                            </router-link>
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
.nav-fill .nav-item .nav-link {
    width: auto;
}
/* 1) Eliminar bordes por defecto de Bootstrap */
ul.nav-tabs {
  border-bottom: none;
  justify-content: flex-start; /* o center si querés centrar todas */
}

/* 2) Estilos del enlace en todas (inactivo) */
.nav-link {
  color: #000;                  /* texto negro */
  font-weight: 700;             /* negrita */
  padding: 0.5rem 1rem;         /* más espacio arriba/abajo y laterales */
  border: none;                 /* quita el borde de pestaña */
  border-radius: 0;             /* sin redondeo */
  position: relative;           /* para el pseudo-elemento ::after */
  transition: color 0.2s;
}

/* 3) Hover suave */
.nav-link:hover {
  color: #5d880d;
}

/* 4) Pestaña activa: texto verde y subrayado */
.nav-link.active {
  color: #5d880d !important;
}

/* 5) Línea verde debajo solo en activa */
.nav-link.active::after {
  content: "";
  display: block;
  width: 50%;
  height: 3px;               /* grosor de la línea */
  background-color: #5d880d;
  position: absolute;
  bottom: -1px;              /* justo debajo del área del link */
  left: 10;
}

/* 6) Si querés separar un toque las dos pestañas */
.nav-item + .nav-item {
  margin-left: 1rem;
}
</style>
