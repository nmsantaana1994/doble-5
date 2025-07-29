<script setup>
import { getFirestore } from "firebase/firestore";
import { useAuth } from "../../composition/useAuth";
import { inscribirPartido } from "../services/partidos";
import { inject } from "vue";
import { notificationProvider } from "../../symbols/symbols";
import { convertirFecha } from "../../helpers/date";

const db = getFirestore();
const { user } = useAuth();
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);

const props = defineProps({
  partido: Object,
});

async function inscribirseAlPartido(idPartido) {
  try {
    clearFeedbackMessage();
    if (idPartido) {
      await inscribirPartido(idPartido, user);
      setFeedbackMessage({
        type: "success",
        message: "Usuario inscripto correctamente.",
      });
      console.log("Usuario inscrito correctamente.");
    } else {
      console.error("No se ha encontrado el partido para inscribirse.");
    }
  } catch (error) {
    console.error("Error al inscribirse al partido:", error);
    setFeedbackMessage({ type: "error", message: error });
  }
}
</script>

<template>
  <div class="row px-3">
    <div class="card p-3 mb-3">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-10">
            <p class="card-title h4 text-start">{{ partido?.nombre }}</p>
          </div>
          <div class="col-2 d-flex justify-content-end">
            <router-link :to="`/info-partido/${partido?.id}`"
              ><img
                src="../../assets/img/arrows-right.png"
                alt="Icono flechas dobles"
                class="icono-h2"
            /></router-link>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-2 d-flex justify-content-start">
            <img
              src="../../assets/img/reloj.png"
              alt="Icono flechas dobles"
              class="icono-h2"
            />
          </div>
          <div class="col-10 d-flex align-items-end">
            <p class="card-subtitle text-body-secondary text-start">
              <b
                >{{ convertirFecha(partido?.fecha) }} -
                {{ partido?.hora }}hs.</b
              >
            </p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-2 d-flex justify-content-start">
            <img
              src="../../assets/img/alfiler.png"
              alt="Icono flechas dobles"
              class="icono-h2"
            />
          </div>
          <div class="col-10 d-flex align-items-end">
            <p class="card-subtitle text-body-secondary text-start">
              Complejo: <b> {{ partido?.complejo?.name }}</b>
            </p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-2 d-flex justify-content-start">
            <img
              src="../../assets/img/jugador-de-futbol.png"
              alt="Icono flechas dobles"
              class="icono-h2"
            />
          </div>
          <div class="col-10 d-flex align-items-end">
            <p class="card-subtitle text-body-secondary text-start">
              Vacantes:
              <b>{{
                partido?.cantidadJ * 2 - partido?.contadorInscriptos.length
              }}</b>
            </p>
          </div>
        </div>
        <div class="row justify-content-around">
          <div
            class="col-6 fondo-boton-card-negro rounded d-flex justify-content-center"
          >
            <router-link
              :to="`/info-partido/${partido?.id}`"
              class="text-white fw-light py-2"
              >VER MÁS</router-link
            >
          </div>
          <div
            @click="inscribirseAlPartido(partido?.id)"
            class="col-6 fondo-boton-card rounded d-flex justify-content-center text-white align-items-center"
          >
            INSCRIBIRME
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icono-h2 {
  width: 25px;
  height: 25px;
}
.icono-card {
  width: 55%;
}

a {
  text-decoration: none;
  color: black;
}

.card {
  background-color: #e6e6e6;
  border: 0;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
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
a {
  text-decoration: none;
  color: black;
}

.icono-card {
  width: 55%;
}
</style>
