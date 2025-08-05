<script setup>
import { ref, onMounted, onUnmounted, inject, watch } from "vue";
import {
  getPartidoById,
  inscribirPartido,
  eliminarJugadorDePartido,
  eliminarPartidoSiSoyCreador,
} from "../services/partidos";
import { getFirestore, doc, onSnapshot, getDoc } from "firebase/firestore";
import { notificationProvider, modalProvider } from "../../symbols/symbols.js";
import { usePartido } from "../../composition/usePartidos";
import { useRoute } from "vue-router";
import { useAuth } from "../../composition/useAuth";
import Image from "../../components/Image.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import Section from "../../components/Section.vue";
import router from "../../router/router.js";

const { showModal } = inject(modalProvider);

const jugadoresActualizados = ref([]);
const db = getFirestore();
const { user } = useAuth();
const route = useRoute();
const { loading } = usePartido(route.params.id);
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);
const partidoDocRef = doc(db, "partidos", route.params.id);

const partidoFiltrado = ref(null);
const flagInscription = ref(false);
const myMatch = ref(false);

onMounted(async () => {
  try {
    const partido = await getPartidoById(route.params.id);
    partidoFiltrado.value = partido;
    flagInscription.value = estaInscripto();
    listenToChanges();
    if (user.value.id === partidoFiltrado.value.userId) {
      myMatch.value = true;
    } else {
      myMatch.value = false;
    }
  } catch (error) {
    console.error(error.message);
  }
});

watch(partidoFiltrado, (newVal, oldVal) => {
  if (newVal) {
    flagInscription.value = estaInscripto();
  }
});

function listenToChanges() {
  const unsubscribe = onSnapshot(partidoDocRef, async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      partidoFiltrado.value = { ...data, id: snapshot.id };

      const jugadores = await Promise.all(
        data.contadorInscriptos.map(async (jugador) => {
          const userDoc = await getDoc(doc(db, "usuarios", jugador.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              uid: jugador.uid,
              nombre: userData.displayName || jugador.nombre,
              image: userData.photoURL || jugador.image,
            };
          }
          return jugador;
        })
      );

      jugadoresActualizados.value = jugadores;
    } else {
      partidoFiltrado.value = null;
    }
  });

  onUnmounted(unsubscribe);
}

async function inscribirseAlPartido() {
  try {
    clearFeedbackMessage();
    if (partidoFiltrado.value) {
      await inscribirPartido(route.params.id, user);
      flagInscription.value = estaInscripto();
      setFeedbackMessage({
        type: "success",
        message: "Usuario inscripto correctamente.",
      });
    }
  } catch (error) {
    setFeedbackMessage({ type: "error", message: error });
  }
}

async function eliminarDePartido(userid) {
  try {
    clearFeedbackMessage();
    if (partidoFiltrado.value) {
      await eliminarJugadorDePartido(userid, route.params.id);
      flagInscription.value = estaInscripto();
      setFeedbackMessage({
        type: "success",
        message: "Usuario eliminado correctamente.",
      });
    }
  } catch (error) {
    setFeedbackMessage({ type: "error", message: error.message });
  }
}

async function eliminarPartido(userid) {
  try {
    const result = await showModal({
      title: "Eliminar partido",
      bodyText: "¿Desea eliminar el partido?",
      closeButtonText: "NO",
      saveButtonText: "SI",
    });
    if (result) {
      try {
        clearFeedbackMessage();
        if (partidoFiltrado.value) {
          await eliminarPartidoSiSoyCreador(route.params.id, userid);
          setFeedbackMessage({
            type: "success",
            message: "Partido eliminado con éxito.",
          });
          router.push("/home");
        }
        return;
      } catch (error) {
        console.error("Error al eliminar el partido:", error);
        setFeedbackMessage({ type: "error", message: error });
      }
    } else if (result === "closex") {
      return;
    }
  } catch (error) {
    setFeedbackMessage({ type: "error", message: error.message });
  }
}

function estaInscripto() {
  if (!partidoFiltrado.value || !partidoFiltrado.value.contadorInscriptos) {
    return false;
  }
  return partidoFiltrado.value.contadorInscriptos.some(
    (usuario) => usuario.uid === user.value.id
  );
}

function formatFecha(fecha) {
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
</script>

<template class="main">
  <Loading :loading="loading" />
  <HeaderPage
    title="Información"
    route="/home"
    :hasBackground="false"
  ></HeaderPage>
  <Section class="row p-1" style="margin: 75px 0 120px 0">
    <div class="col-12 fotoCancha mb-3">
      <img src="../../assets/img/cancha.jpg" />
    </div>
    <div class="row mx-auto infoPartido">
      <div class="col-9 fw-bold nombreComplejo">
        <p>
          {{ partidoFiltrado ? partidoFiltrado.complejo.name : "-" }}
        </p>
      </div>
      <div class="col-3 d-flex justify-content-center">
        <p class="text-center mb-0 lh-sm">
          {{
            partidoFiltrado
              ? partidoFiltrado.cantidadJ + " vs " + partidoFiltrado.cantidadJ
              : "-"
          }}
          {{ partidoFiltrado ? partidoFiltrado.tipo : "-" }}
        </p>
      </div>
    </div>

    <div class="row mx-auto my-2 infoPartido">
      <div class="col-12">
        <p class="mb-0">
          <span class="fw-bold text-black">Dirección:</span>
          {{ partidoFiltrado ? partidoFiltrado.complejo.direction : "-" }}
        </p>
      </div>
      <div class="col-12">
        <p>
          <span class="fw-bold"> Día:</span>
          {{ partidoFiltrado ? formatFecha(partidoFiltrado.fecha) : "-" }}
        </p>
      </div>
      <div class="col-12">
        <p class="mb-0">
          <span class="fw-bold"> Horario:</span>
          {{ partidoFiltrado ? partidoFiltrado.hora : "-" }} hs.
        </p>
      </div>
    </div>
    <div class="row mx-auto mt-2 infoPartido">
      <div class="col-12">
        <p>
          Organizado por: <br />
          <router-link
            :to="`/usuario/${partidoFiltrado?.userId}`"
            class="col-12 mb-3 text-decoration-none text-dark"
          >
            <small style="color: var(--primary-color)">{{
              partidoFiltrado ? partidoFiltrado.usuarioCreador : "-"
            }}</small>
          </router-link>
        </p>
      </div>
    </div>

    <div class="row mx-auto">
      <div class="col-12">
        <p class="text-center fs-2 fw-bold">Jugadores</p>
      </div>
    </div>

    <div
      class="row d-flex align-items-center border-bottom mb-2 pb-2 mx-auto"
      v-for="nombreJugador in jugadoresActualizados"
    >
      <div class="col-3">
        <Image :src="nombreJugador.image" />
      </div>
      <div class="col-8 pt-3 jugadores">
        <p>
          <span class="fw-bold">{{ nombreJugador.nombre }}</span>
          <br />
          <router-link
            :to="`/usuario/${nombreJugador.uid}`"
            style="color: var(--primary-color)"
          >
            Ver Perfil
          </router-link>
        </p>
      </div>
      <div class="col-1 pt-0">
        <button
          class="button__delete"
          @click="eliminarDePartido(nombreJugador.uid)"
          v-show="myMatch || nombreJugador.uid === user.id"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
    <div class="botones_inferiores">
      <button @click="inscribirseAlPartido" v-show="!flagInscription">
        UNIRME AL PARTIDO
      </button>

      <button @click="eliminarPartido(user.id)" v-show="myMatch">
        ELIMINAR PARTIDO
      </button>
    </div>
  </Section>
</template>

<style scoped>
ul {
  list-style: none;
}

.infoPartido {
  color: grey;
}
.infoPartido span,
.nombreComplejo {
  color: rgb(75, 75, 75);
}
.button__delete {
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
}
i {
  color: red;
}
.fotoCancha {
  width: 100%;
  background-color: red;
  margin: 0;
  padding: 0;
}
.fotoCancha img {
  width: calc(100% + 2rem);
  margin: 0 -1rem;
}

.botones_inferiores {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0 0 0 0;

  & :first-child,
  :last-child {
    width: 100%;
    margin: 0;
    border: none;
    color: white;
    padding: 0.3rem;
  }
  & :first-child {
    height: 60px;
    width: 100%;
    background-color: var(--primary-color);
  }
  & :last-child {
    height: 60px;
    width: 100%;

    background-color: red;
  }
}
</style>
