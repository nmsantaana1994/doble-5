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
                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li>
                                    <div class="d-flex justify-content-between">
                                        <router-link :to="'/home'" class="col-2 text-decoration-none text-black">
                                            <img src="./assets/img/home-offcanvas.png" alt="Icono de home" class="icono-nav" />
                                            <p>Home</p>
                                        </router-link>
                                        <router-link :to="'/mis-partidos'" class="col-2 text-decoration-none text-black">
                                            <img src="./assets/img/home-offcanvas.png" alt="Icono de home" class="icono-nav" />
                                            <p>Mis partidos</p>
                                        </router-link>
                                    </div>
                                </li>
                                <li>
                                    <form
                                        action="#"
                                        method="post"
                                        @submit.prevent="handleLogout"
                                    >
                                        <button type="submit">{{ user.email }} (Cerrar Sesión)</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- <router-link to="/" class="text-2xl">DV-Chat</router-link>
                <ul class="sm:flex gap-4">
                    <li>
                        <router-link class="block py-2 sm:p-0" to="/home">Home</router-link>
                    </li>
                        
                        <li>
                            <router-link class="block py-2 sm:p-0" to="/chat">Chat</router-link>
                        </li>
                        <li>
                            <router-link class="block py-2 sm:p-0" to="/perfil">Mi Perfil</router-link>
                        </li>
                        <li>
                            <form
                                action="#"
                                method="post"
                                @submit.prevent="handleLogout"
                            >
                                <button type="submit">{{ user.email }} (Cerrar Sesión)</button>
                            </form>
                        </li>
                </ul> -->
            
        </nav>
    </template>
    <!-- <footer class="flex justify-center items-center h-[150px] bg-gray-900 text-white">
        <p>&copy; Da Vinci 2023</p>
    </footer> -->

</template>

<style>
    ul {
        list-style: none;
    }
    
    .icono-nav {
        width: 75%;
    }
</style>