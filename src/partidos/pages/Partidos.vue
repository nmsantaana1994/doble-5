<!-- <script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../composition/useAuth.js";
import { getPartidos, getPartidosByCountry } from "../services/partidos.js";
import { ref, onMounted } from "vue";
import CardPartido from "../components/CardPartido.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
const { user } = useHome();

function useHome() {
  const { user } = useAuth();

  return {
    user,
  };
}

async function getPartidosFromService() {
  const partidos = await getPartidos();
  console.log("partidos", partidos);
  return partidos;
}

const partidos = ref([]);

const auth = getAuth();

const Mispartidos = ref([]);

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
  console.log("partido filtrado", filteredPartidos);
  Mispartidos.value = filteredPartidos;
}

async function searchByCountry(localidad) {
  const partidosData = await getPartidosByCountry(localidad);
  console.log(partidosData);
  partidos.value = partidosData;
}

onMounted(async () => {
  partidos.value = await getPartidosFromService();
  console.log("partidos", partidos.value);
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    await getPartidosForUser(uid);
  }
});

async function getPartidosPage() {
  partidos.value = await getPartidosFromService();
}
</script>

<template>
  <HeaderPage route="/home" title="Partidos" />
  <Section>
    <div class="row mb-3">
      <ul class="nav nav-tabs mb-3" role="tablist">
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
        <div
          class="tab-pane fade show active"
          id="mis-partidos-tab-pane"
          role="tabpanel"
          aria-labelledby="mis-partidos-tab"
          tabindex="0"
        >
          <template v-if="partidos.length > 0">
            <cardPartido
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
          <p>filtro por barrio</p>
          <ul>
            <li @click="searchByCountry('caballito')">caballito</li>
            <li @click="getPartidosPage()">quitar filtros</li>
          </ul>
          <template v-if="partidos.length > 0">
            <cardPartido
              v-for="partido in partidos"
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
      </div>
    </div>
  </Section>
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
</style> -->
<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../composition/useAuth.js";
import {
  getFirestore,
  collection,
  query,
  where,
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

const localidadFiltro = ref("");
let unsubscribe = null;

function listenToPartidos(userId) {
  const q = query(collection(db, "partidos"), where("estado", "==", "activo"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    const todos = [];
    const mios = [];

    snapshot.forEach((doc) => {
      const partido = { ...doc.data(), id: doc.id };
      // Filtrar por barrio si está activo el filtro
      if (
        !localidadFiltro.value ||
        partido.localidad === localidadFiltro.value
      ) {
        todos.push(partido);
      }
      if (partido.userId === userId) {
        mios.push(partido);
      }
    });

    partidos.value = todos;
    Mispartidos.value = mios;
  });
}

function searchByCountry(localidad) {
  localidadFiltro.value = localidad;
  // Relanza el listener para aplicar filtro
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

onMounted(() => {
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
            <div class="col-8">
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
                <option value="caballito">Caballito</option>
                <option value="palermo">Palermo</option>
                <option value="flores">Flores</option>
                <option value="belgrano">Belgrano</option>
              </select>
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-secondary w-100"
                @click="getPartidosPage"
              >
                Quitar filtro
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
                <p>No hay partidos para mostrar</p>
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
