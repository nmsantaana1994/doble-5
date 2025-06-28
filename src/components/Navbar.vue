<script setup>
import Image from "./Image.vue";
import { logout } from "../services/auth";
import { useRouter } from "vue-router";
import { useAuth } from "../composition/useAuth.js";
import { ref, onMounted, onUnmounted } from "vue";
import { obtenerNumeroNotificacionesNoLeidas } from "../notifications/services/notifications";

const { user } = useAuth();
const { handleLogout } = useLogout();
const notificacionesNoLeidas = ref(0); // Número de notificaciones no leídas
let unsubscribe = null;

function useLogout() {
  const router = useRouter();

  return {
    handleLogout() {
      logout();
      router.push({ path: "/iniciar-sesion" });
    },
  };
}

// Escuchar el número de notificaciones no leídas en tiempo real
onMounted(() => {
  if (user.value && user.value.id) {
    unsubscribe = obtenerNumeroNotificacionesNoLeidas(
      user.value.id,
      (numero) => {
        console.log("Actualizando badge de notificaciones:", numero); // Depuración
        notificacionesNoLeidas.value = numero;
      }
    );
  }
});

// Limpiar el listener al desmontar el componente
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <nav
    class="navbar container-fluid d-flex flex-column justify-content-between fixed-bottom bg-dark p-3"
  >
    <div class="w-100 align-items-center p-0">
      <ul class="row m-0 p-0 justify-content-between nav-bottom">
        <li class="col-2 p-0 mx-1">
          <a
            class="col-2 w-auto d-flex justify-content-center"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <img
              src="../assets/img/menu-hamburguesa.png"
              alt="Sobre para mandar mensajes"
              class="icono-nav"
            />
          </a>
        </li>
        <li class="col-2 p-0 mx-1">
          <router-link :to="'/chat'" class="d-flex justify-content-center">
            <img
              src="../assets/img/sobre.png"
              alt="Sobre para mandar mensajes"
              class="icono-nav"
            />
          </router-link>
        </li>
        <li class="col-2 p-0 mx-1">
          <router-link
            :to="`/carga-partidos`"
            class="d-flex justify-content-center"
          >
            <img
              src="../assets/img/plus.png"
              alt="Icono de agregar partido"
              class="icono-nav"
            />
          </router-link>
        </li>
        <li class="col-2 p-0 mx-1">
          <router-link
            :to="'/notificaciones'"
            class="d-flex justify-content-center position-relative"
          >
            <img
              src="../assets/img/campanas.png"
              alt="Campanas de notificaciones"
              class="icono-nav"
            />
            <!-- Badge para notificaciones no leídas -->
            <span
              v-if="notificacionesNoLeidas > 0"
              class="badge bg-danger position-absolute top-0 start-100 translate-middle"
            >
              {{ notificacionesNoLeidas }}
            </span>
          </router-link>
        </li>
        <li class="col-2 p-0 mx-1">
          <router-link :to="'/perfil'" class="d-flex justify-content-center">
            <img
              src="../assets/img/usuario.png"
              alt="Icono de usuario"
              class="icono-nav"
            />
          </router-link>
        </li>
      </ul>

      <!-- Offcanvas -->
      <div
        class="offcanvas offcanvas-start ancho-offcanvas rounded-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-body pt-5">
          <ul class="navbar-nav justify-content-start flex-grow-1 px-3 pt-4">
            <li class="row d-flex align-items-center mb-3">
              <div class="col-5">
                <Image :src="user.photoURL" />
              </div>
              <div class="col-7 p-0">
                <p class="text-start h4 m-0">
                  {{ user.displayName ? user.displayName : user.nombre }}
                </p>
                <p class="text-start m-0">{{ user.email }}</p>
              </div>
            </li>
            <li>
              <router-link
                :to="'/home'"
                class="row text-decoration-none d-flex align-items-center my-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/home-offcanvas.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Home</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/feed'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/red-social.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Feed</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/partidos'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/pelota.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Mis partidos</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/red'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/usuarios.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Red</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/chat'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/sobre-offcanvas.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Mensajes</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/notificaciones'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/campanas-offcanvas.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Notificaciones</p>
              </router-link>
            </li>
            <hr style="border: none; height: 3px; background-color: #5d880d; width: 100%; opacity: 100;" />
            <li>
              <router-link
                :to="'/ajustes'"
                class="row text-decoration-none d-flex my-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/ajustes.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Ajustes</p>
              </router-link>
            </li>
            <li>
              <router-link
                :to="'/ayuda'"
                class="row text-decoration-none d-flex mb-3"
                data-bs-dismiss="offcanvas"
              >
                <img
                  src="../assets/img/ayuda.png"
                  alt="Icono de home"
                  class="col-4 icono-nav-offcanvas px-2"
                />
                <p class="text-start col-8 m-0">Ayuda</p>
              </router-link>
            </li>
            <li>
              <form action="#" method="post" @submit.prevent="handleLogout">
                <button
                  type="submit"
                  class="btn row text-decoration-none d-flex mb-3 p-0"
                >
                  <img
                    src="../assets/img/logout.png"
                    alt="Icono de logout"
                    class="col-4 icono-nav-offcanvas px-2"
                  />
                  <p class="text-start col-8 m-0">Cerrar Sesión</p>
                </button>
              </form>
            </li>
          </ul>
          <div class="row d-flex justify-content-center pt-6">
            <img
              src="../assets/img/logo-original.png"
              alt="Logo Doble-5"
              class="ancho-logo"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

a {
  text-decoration: none;
  color: black;
}

ul {
  list-style: none;
}

.nav-bottom li a {
  max-width: 70px;
}

.icono-nav {
  width: 60%;
}

.icono-nav-offcanvas {
  width: 15%;
  height: 15%;
}

.ancho-offcanvas {
  width: 80%;
}

.ancho-logo {
  width: 60%;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}

.pt-6 {
  padding-top: 6rem;
}
</style>
