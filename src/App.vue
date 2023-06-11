<script setup>
    import { logout } from "./services/auth";
    import {useRouter} from "vue-router";
    import {useAuth} from "./composition/useAuth.js"

    const {user} = useAuth();
    const {handleLogout} = useLogout();

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
        <router-view />
    </main>

    <template v-if="user.id !== null">
    <nav class="navbar fixed-bottom bg-light">
            <div class="container-fluid mx-3">
                <div class="row justify-content-between align-items-center">
                    <a class="navbar-toggler col-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </a>
    
                    <router-link :to="'/chat'" class="col-2">
                        <img src="./assets/img/sobre.png" alt="Sobre para mandar mensajes" class="icono-nav" />
                    </router-link>
                    
                    <div class="col-2 fondo-plus rounded">
                        <router-link :to="`/carga-partidos`">
                            <img src="./assets/img/plus.png" alt="Icono de agregar partido" class="icono-nav-plus" />
                        </router-link>
                    </div>
    
                    <a class="col-2"><img src="./assets/img/campanas.png" alt="Campanas de notificaciones" class="icono-nav" /></a>
    
                    <router-link :to="'/perfil'" class="col-2">
                        <img src="./assets/img/usuario.png" alt="Icono de usuario" class="icono-nav" />
                    </router-link>
    
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
                                            <img src="./assets/img/hogar.png" alt="Icono de home" class="icono-nav" />
                                            <p>Home</p>
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
    .icono-nav {
        width: 75%;
    }

    .icono-nav-plus {
        width: 100%;
    }

    .fondo-plus {
        background-color: #5d880d;
    }
</style>