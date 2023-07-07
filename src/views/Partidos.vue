<script setup>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { useAuth } from "../composition/useAuth.js";
    import { getPartidos } from "../services/partidos";
    import { ref, onMounted } from "vue";

    const { user } = useHome();

    function useHome() {
        const { user } = useAuth();

        return {
          user,
        };
    }

    async function getPartidosFromService() {
        const partidos = await getPartidos();
        console.log(partidos);
        return partidos;
    }

    const partidos = ref([]);

    onMounted(async () => {
        partidos.value = await getPartidosFromService();
    });

    // Mis Partidos

    const auth = getAuth();

    // Crea una referencia reactiva a `partidos`
    const Mispartidos = ref([]);

    // Observa los cambios de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(uid);
            getPartidosForUser(uid);
        } else {
            console.log("Usuario no autenticado");
        }
    });

    async function getPartidosForUser(UsuarioId) {
        const partidosData = await getPartidos();
        console.log(partidosData);

        // Filtrar los partidos por ID del creador coincidente con el ID del usuario autenticado
        const filteredPartidos = partidosData.filter(
            (partido) => partido.userId === UsuarioId
            
        );
        console.log('partido filtrado',filteredPartidos)
        Mispartidos.value = filteredPartidos;
    }

    onMounted(async () => {
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          await getPartidosForUser(uid);
        }
    });
</script>

<template>
    <section class="px-3 pb-3 mb-5">
        <div class="row background-partido mb-3 m-auto p-4 rounded-bottom">
            <h1 class="text-white text-center p-2">Partidos</h1>
        </div>
        <div class="row mb-3">
            <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="mis-partidos-tab" data-bs-toggle="tab" data-bs-target="#mis-partidos-tab-pane" type="button" role="tab" aria-controls="mis-partidos-tab-pane" aria-selected="true">Mis Partidos</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="proximos-partidos-tab" data-bs-toggle="tab" data-bs-target="#proximos-partidos-tab-pane" type="button" role="tab" aria-controls="proximos-partidos-tab-pane" aria-selected="false">Próximos partidos</button>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="mis-partidos-tab-pane" role="tabpanel" aria-labelledby="mis-partidos-tab" tabindex="0">
                    <template v-if="partidos.length > 0">
                        <div
                            class="card p-3 mb-3"
                            v-for="partido in Mispartidos"
                            :key="partido.id"
                        >
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-10">
                                        <p class="card-title h3 text-start">{{ partido.nombre }}</p>
                                    </div>
                                    <div class="col-2 d-flex justify-content-end">
                                        <img src="../assets/img/arrows-right.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-2 d-flex justify-content-start">
                                        <img src="../assets/img/reloj.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                    <div class="col-10 d-flex align-items-end">
                                        <p class="card-subtitle h6 text-body-secondary text-start">{{ partido.fecha }} {{ partido.hora }}</p>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-2 d-flex justify-content-start">
                                        <img src="../assets/img/alfiler.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                    <div class="col-10 d-flex align-items-end">
                                        <p class="card-subtitle h6 text-body-secondary text-start">{{ partido.complejo }}</p>
                                    </div>
                                </div>
                                <div class="row justify-content-around">
                                    <div class="col-6 fondo-boton-card-negro rounded d-flex justify-content-center">
                                        <router-link :to="`/info-partido/${partido.nombre}`" class="text-white" >Ver más</router-link>
                                    </div>
                                    <div class="col-6 fondo-boton-card rounded d-flex justify-content-center">
                                      <router-link :to="`/inscription/${partido.nombre}`" class="text-white">Inscribirme</router-link>
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
                </div>
                <div class="tab-pane fade" id="proximos-partidos-tab-pane" role="tabpanel" aria-labelledby="proximos-partidos-tab" tabindex="0">
                    <template v-if="partidos.length > 0">
                        <div
                            class="card p-3 mb-3"
                            v-for="partido in partidos"
                            :key="partido.id"
                        >
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-10">
                                        <p class="card-title h3 text-start">{{ partido.nombre }}</p>
                                    </div>
                                    <div class="col-2 d-flex justify-content-end">
                                        <img src="../assets/img/arrows-right.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-2 d-flex justify-content-start">
                                        <img src="../assets/img/reloj.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                    <div class="col-10 d-flex align-items-end">
                                        <p class="card-subtitle h6 text-body-secondary text-start">{{ partido.fecha }} {{ partido.hora }}</p>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-2 d-flex justify-content-start">
                                        <img src="../assets/img/alfiler.png" alt="Icono flechas dobles" class="icono-h2" />
                                    </div>
                                    <div class="col-10 d-flex align-items-end">
                                        <p class="card-subtitle h6 text-body-secondary text-start">{{ partido.complejo }}</p>
                                    </div>
                                </div>
                                <div class="row justify-content-around">
                                    <div class="col-6 fondo-boton-card-negro rounded d-flex justify-content-center">
                                        <router-link :to="`/info-partido/${partido.nombre}`" class="text-white">Ver más</router-link>
                                    </div>
                                    <div class="col-6 fondo-boton-card rounded d-flex justify-content-center">
                                      <router-link :to="`/inscription/${partido.nombre}`" class="text-white">Inscribirme</router-link>
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
                </div>
          </div>
        </div>
    </section>
</template>

<style scoped>
    .background-partido {
        background-image: url("../assets/img/background-partidos.png");
        width: 100%;
        background-size: cover;
        height: 15vh;
    }

    .fondo-titulo {
        background-color: #5d880d;
    }

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
        width: 35%;
    }

    .fondo-boton-card-negro {
        background-color: #000000;
        width: 35%;
    }
</style>
