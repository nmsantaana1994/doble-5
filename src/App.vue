<script setup>
    import { logout } from "./services/auth";
    import {useRouter} from "vue-router";
    import {useAuth} from "./composition/useAuth.js"
    import { provide, ref } from "vue";
    import Notification from "./components/Notification.vue";
    import { notificationProvider } from "./symbols/symbols.js";

    const {user} = useAuth();
    const {handleLogout} = useLogout();

    const feedback = ref({
        message: "",
        type: "",
        title: "",
        closable: true,
    });

    function setFeedbackMessage({message, type = "succes", title = ""}) {
        feedback.value = {
            ...feedback.value,
            message,
            type,
            title,
        }
    }

    function clearFeedbackMessage() {
        feedback.value = {
            ...feedback.value,
            message: "",
            type: "",
            title: "",
        }
    }

    provide(notificationProvider, {
        feedback,
        setFeedbackMessage,
        clearFeedbackMessage,
    });

    function useLogout() {
        const router = useRouter();

        return {
            handleLogout() {
                logout();
                // Redireccionamos al usuario al login.
                router.push({path: '/iniciar-sesion'});
            }
        }
    }
</script>

<template>

    <main class="container-full h-full m-auto">
        <Notification
            :data="feedback"
            @close="clearFeedbackMessage"
        />

        <router-view />
    </main>

    <template v-if="user.id !== null">
        <nav class="navbar fixed-bottom bg-dark">
                <div class="container-fluid align-items-center p-0">
                    <ul class="row m-0 p-0 justify-content-center">
                        <li class="col-2 p-0 mx-1">
                            <a class="col-2 w-auto d-flex justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                                <img src="./assets/img/menu-hamburguesa.png" alt="Sobre para mandar mensajes" class="icono-nav" />
                            </a>
                        </li>
                        <li class="col-2 p-0 mx-1">
                            <router-link :to="'/chat'" class="d-flex justify-content-center">
                                <img src="./assets/img/sobre.png" alt="Sobre para mandar mensajes" class="icono-nav" />
                            </router-link>
                        </li>
                        <li class="col-2 p-0 mx-1">
                            <router-link :to="`/carga-partidos`"  class="d-flex justify-content-center">
                                <img src="./assets/img/plus.png" alt="Icono de agregar partido" class="icono-nav" />
                            </router-link>
                        </li>
                        <li class="col-2 p-0 mx-1">
                            <router-link :to="'/list-private-chats'" class="d-flex justify-content-center">
                                <img src="./assets/img/campanas.png" alt="Campanas de notificaciones" class="icono-nav" />
                            </router-link>
                        </li>
                        <li class="col-2 p-0 mx-1">
                            <router-link :to="'/perfil'" class="d-flex justify-content-center">
                                <img src="./assets/img/usuario.png" alt="Icono de usuario" class="icono-nav" />
                            </router-link>
                        </li>
                    </ul>

                    <!-- Offcanvas -->
                    <div class="offcanvas offcanvas-start ancho-offcanvas rounded-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header">
                            <p class="offcanvas-title h5" id="offcanvasNavbarLabel">Menú</p>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-start flex-grow-1 pe-3 pb-5">
                                <li class="row">
                                    <div class="col-4 mb-3 d-flex justify-content-center">
                                        <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
                                    </div>
                                    <div class="col-8">
                                        <p class="text-start h4">
                                            {{ user.displayName ? user.displayName : user.nombre }} 
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <router-link :to="'/home'" class="col-12 text-decoration-none d-flex my-3">
                                        <img src="./assets/img/home-offcanvas.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Home</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/feed'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/red-social.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Feed</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/mis-partidos'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/pelota.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Mis partidos</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/red'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/usuarios.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Red</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/chat'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/sobre.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Mensajes</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/notificaciones'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/campanas.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Notificaciones</p>
                                    </router-link>
                                </li>
                                <hr />
                                <li>
                                    <router-link :to="'/ajustes'" class="col-12 text-decoration-none d-flex my-3">
                                        <img src="./assets/img/campanas.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Ajustes</p>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="'/ayuda'" class="col-12 text-decoration-none d-flex mb-3">
                                        <img src="./assets/img/campanas.png" alt="Icono de home" class="icono-nav-offcanvas" />
                                        <p class="m-auto text-start">Ayuda</p>
                                    </router-link>
                                </li>
                                <li>
                                    <form
                                        action="#"
                                        method="post"
                                        @submit.prevent="handleLogout"
                                    >
                                        <button type="submit" class="btn col-12 text-decoration-none d-flex mb-3">
                                            <img src="./assets/img/logout.png" alt="Icono de logout" class="icono-nav-offcanvas" />
                                            <p class="m-auto text-start">Cerrar Sesión</p>
                                        </button>
                                    </form>
                                </li>
                            </ul>
                            <div class="row d-flex justify-content-center pt-5">
                                <img src="./assets/img/logo-original.png" alt="Logo Doble-5" class="ancho-logo"/>
                            </div>
                        </div>
                    </div>
                </div>   
        </nav>
    </template>
    <!-- <footer class="flex justify-center items-center h-[150px] bg-gray-900 text-white">
        <p>&copy; Da Vinci 2023</p>
    </footer> -->

</template>

<style scoped>
    a {
        text-decoration: none;
        color: black;
    }
    ul {
        list-style: none;
    }
    
    .icono-nav {
        width: 60%;
    }

    .icono-nav-offcanvas {
        width: 10%;
    }

    .ancho-offcanvas {
        width: 80%;
    }

    .ancho-logo {
        width: 80%;
    }
</style>