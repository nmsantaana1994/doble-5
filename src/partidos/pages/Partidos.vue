<script setup>
import { getAuth } from "firebase/auth";
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
import { ref, onMounted, onUnmounted, watch } from "vue";
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

const barrios = ref([]);

const localidadFiltro = ref("");
let unsubscribe = null;

function listenToPartidos(userId) {
  if (unsubscribe) unsubscribe();

  let q;

  if (localidadFiltro.value) {
    q = query(
      collection(db, "partidos"),
      where("estado", "==", "activo"),
      where("complejo.localidad", "==", localidadFiltro.value)
    );
  } else {
    q = query(collection(db, "partidos"), where("estado", "==", "activo"));
  }

  unsubscribe = onSnapshot(q, (snapshot) => {
    const todos = [];
    const mios = [];

    snapshot.forEach((doc) => {
      const partido = { ...doc.data(), id: doc.id };

      todos.push(partido);

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

    console.log("partidos actuales:", partidos.value);
  });
}

watch(localidadFiltro, (newValue) => {
  const user = auth.currentUser;
  if (user) {
    listenToPartidos(user.uid);
  }
});

function getPartidosPage() {
  localidadFiltro.value = "";
  const user = auth.currentUser;
  if (user) {
    listenToPartidos(user.uid);
  }
}

onMounted(async () => {
  const docRef = doc(db, "barrios", "capital_federal");
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
              >
                <option disabled value="">Selecciona un barrio</option>
                <option v-for="barrio in barrios" :key="barrio" :value="barrio">
                  {{ barrio }}
                </option>
              </select>
            </div>
            <div class="col-2">
              <button class="boton_filtro" @click="getPartidosPage">
                <img
                  class="img_filtro"
                  src="../../../src/assets/img/iconos_filtro .png"
                  alt="icono-filtro"
                />
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

ul.nav-tabs {
  border-bottom: none;
  justify-content: flex-start;
}

.nav-link {
  color: #000;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #5d880d;
}

.nav-link.active {
  color: #5d880d !important;
}

.nav-link.active::after {
  content: "";
  display: block;
  width: 50%;
  height: 3px;
  background-color: #5d880d;
  position: absolute;
  bottom: -1px;
  left: 10;
}

.nav-item + .nav-item {
  margin-left: 1rem;
}

.boton_filtro {
  border: 1px solid grey;
  border-radius: 4px;
  background-color: transparent;
  outline: none;
  padding: 0.4rem;
}
.img_filtro {
  width: 100%;
}
</style>
