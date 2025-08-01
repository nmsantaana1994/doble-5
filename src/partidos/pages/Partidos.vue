<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../composition/useAuth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, onMounted, onUnmounted } from "vue";
import CardPartido from "../components/CardPartido.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";

const { user } = useHome();
function useHome() {
  const { user } = useAuth();
  return { user };
}

const db = getFirestore();
const partidos = ref([]);
const Mispartidos = ref([]);
const auth = getAuth();

const barrios = ref([]); // para guardar los barrios cargados

const localidadFiltro = ref("");
let unsubscribe = null;

function listenToPartidos(userId) {
  const q = query(collection(db, "partidos"), where("estado", "==", "activo"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    const todos = [];
    const mios = [];

    snapshot.forEach((doc) => {
      const partido = { ...doc.data(), id: doc.id };

      if (
        !localidadFiltro.value ||
        partido.localidad === localidadFiltro.value
      ) {
        todos.push(partido);
      }

      const esCreador = partido.userId === userId;
      const estaInscripto = partido.contadorInscriptos?.some(
        (jugador) => jugador.uid === userId
      );

      if (esCreador || estaInscripto) {
        mios.push(partido);
      }
    });

    partidos.value = todos;
    Mispartidos.value = mios;
  });
}

function searchByCountry(localidad) {
  localidadFiltro.value = localidad;
  const user = auth.currentUser;
  if (user) {
    listenToPartidos(user.uid);
  }
}

function getPartidosPage() {
  localidadFiltro.value = null;
  const user = auth.currentUser;
  if (user) {
    listenToPartidos(user.uid);
  }
}

// onMounted(() => {
//   const user = auth.currentUser;
//   if (user) {
//     listenToPartidos(user.uid);
//   }
// });

onMounted(async () => {
  const docRef = doc(db, "barrios", "capital_federal");
  debugger;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    barrios.value = docSnap.data().nombres || [];
    console.log("barrios", barrios.value);
  } else {
    console.warn("Documento capital_federal no encontrado");
  }

  const user = auth.currentUser;
  if (user) {
    listenToPartidos(user.uid);
  }
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<template>
  <HeaderPage route="/home" title="Partidos" />
  <Section>
    <div class="row mb-3">
      <ul class="nav nav-tabs mb-5 mt-3 px-3" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="mis-partidos-tab"
            data-bs-toggle="tab"
            data-bs-target="#mis-partidos-tab-pane"
            type="button"
            role="tab"
            aria-controls="mis-partidos-tab-pane"
            aria-selected="true"
          >
            Mis Partidos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="proximos-partidos-tab"
            data-bs-toggle="tab"
            data-bs-target="#proximos-partidos-tab-pane"
            type="button"
            role="tab"
            aria-controls="proximos-partidos-tab-pane"
            aria-selected="false"
          >
            Próximos partidos
          </button>
        </li>
      </ul>

      <div class="tab-content" id="myTabContent">
        <!-- MIS PARTIDOS -->
        <div
          class="tab-pane fade show active"
          id="mis-partidos-tab-pane"
          role="tabpanel"
          aria-labelledby="mis-partidos-tab"
          tabindex="0"
        >
          <template v-if="Mispartidos.length > 0">
            <CardPartido
              v-for="partido in Mispartidos"
              :key="partido.id"
              :partido="partido"
            />
          </template>
          <template v-else>
            <div class="row px-3">
              <div class="col-12">
                <p>No hay partidos para mostrar</p>
              </div>
            </div>
          </template>
        </div>

        <!-- PROXIMOS PARTIDOS -->
        <div
          class="tab-pane fade"
          id="proximos-partidos-tab-pane"
          role="tabpanel"
          aria-labelledby="proximos-partidos-tab"
          tabindex="0"
        >
          <div class="row mb-3 align-items-end">
            <div class="col-10">
              <label for="barrioSelect" class="form-label fw-bold"
                >Filtrar por barrio</label
              >
              <select
                id="barrioSelect"
                class="form-select"
                v-model="localidadFiltro"
                @change="searchByCountry(localidadFiltro)"
              >
                <option disabled value="">Selecciona un barrio</option>
                <option v-for="barrio in barrios" :key="barrio" :value="barrio">
                  {{ barrio }}
                </option>
              </select>
            </div>
            <div class="col-2">
              <button
                class="btn btn-outline-secondary w-100"
                @click="getPartidosPage"
              >
                X
              </button>
            </div>
          </div>
          <template v-if="partidos.length > 0">
            <CardPartido
              v-for="partido in partidos"
              :key="partido.id"
              :partido="partido"
            />
          </template>
          <template v-else>
            <div class="row px-3">
              <div class="col-12">
                <p>No existen partidos en la zona seleccionada.</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.icono-h2 {
  width: 25px;
  height: 25px;
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

a {
  text-decoration: none;
  color: black;
}

.icono-card {
  width: 55%;
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

.filtro {
  background-color: red;
  width: 30%;
  margin: auto;
  text-align: right;
}

select.form-select {
  background-color: #f8f9fa;
  border-radius: 0.375rem;
}

/* 1) Eliminar bordes por defecto de Bootstrap */
ul.nav-tabs {
  border-bottom: none;
  justify-content: flex-start; /* o center si querés centrar todas */
}

/* 2) Estilos del enlace en todas (inactivo) */
.nav-link {
  color: #000; /* texto negro */
  font-weight: 700; /* negrita */
  padding: 0.5rem 1rem; /* más espacio arriba/abajo y laterales */
  border: none; /* quita el borde de pestaña */
  border-radius: 0; /* sin redondeo */
  position: relative; /* para el pseudo-elemento ::after */
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
  height: 3px; /* grosor de la línea */
  background-color: #5d880d;
  position: absolute;
  bottom: -1px; /* justo debajo del área del link */
  left: 10;
}

/* 6) Si querés separar un toque las dos pestañas */
.nav-item + .nav-item {
  margin-left: 1rem;
}
</style>
