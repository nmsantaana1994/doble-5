<script setup>
import { ref, onMounted, watch, computed, inject } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { useRouter } from "vue-router";
import { cargarPartido } from "../services/partidos.js";
import { getCanchas } from "../../canchas/services/canchas.js";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
import { notificationProvider, modalProvider } from "../../symbols/symbols.js";
import { inscribirPartido } from "../services/partidos.js";

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
const { showModal } = inject(modalProvider);
const { fields, user, loading, handleSubmit } = useCargaPartido();
const canchas = ref([]);
const selectedDia = ref('');
const availableHorarios = ref([]);
const selectedCancha = ref(null);

function useCargaPartido() {
  const { user } = useAuth();
  const router = useRouter();

  const fields = ref({
    nombre: "",
    complejo: "",
    fecha: "",
    hora: "",
    cantidadJ: 0,
    contadorInscriptos: [],
    totalJ: 0,
    cambios: "",
    tipo: "",
    usuarioCreador: "",
    valorCancha: "",
  });

  const loading = ref(false);

  async function handleSubmit() {
    try {
      clearFeedbackMessage();
      loading.value = true;

      let reserva = {
        fecha: selectedDia.value,
        hora: fields.value.hora
      }
      const partido = await cargarPartido({
        ...fields.value,
        userId: user.value.id,
        usuarioCreador: user.value.displayName,
        complejo: selectedCancha.value,
        fecha: selectedDia.value
      }, reserva);
      loading.value = false;
      setFeedbackMessage({ type: 'success', message: 'Partido creado correctamente' });
      // Llamar a showModal justo después de crear el partido
      const result = await showModal({
        title: 'Partido creado',
        bodyText: 'desea sumarse como jugador al partido?.',
        closeButtonText: 'Cancelar',
        saveButtonText: 'Aceptar'
      });
      if (result) {
        try {
          clearFeedbackMessage()
          if (partido.id) {
            await inscribirPartido(partido.id, user);
            setFeedbackMessage({ type: 'success', message: 'usuario inscripto correctamente.' })
            router.push(`/info-partido/${partido.id}`);
          } else {
            console.error("No se ha encontrado el partido para inscribirse.");
          }
        } catch (error) {
          console.error("Error al inscribirse al partido:", error);
          setFeedbackMessage({ type: 'error', message: error })

        }
      } else if (!result) {
        console.log('no sumarme al partido')
        router.push("/home");
      } else if (result === 'closex') {
        console.log('no hacer nada')
        router.push("/home");
        return;
      }
    } catch (error) {
      setFeedbackMessage({ type: 'error', message: error.message || 'Error al crear el partido' });
    }
  }

  return {
    fields,
    user,
    loading,
    handleSubmit,
  };
}

onMounted(async () => {
  try {
    const canchasData = await getCanchas();
    canchas.value = canchasData;
    console.log(canchas.value);
  } catch (error) {
    console.error(error.message);
  }
});

// Calcula la fecha mínima estableciendo la fecha actual
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

function handleCanchaChange() {
  if (selectedCancha.value && selectedDia.value) {
    const horarios = Object.keys(selectedCancha.value.horarios || {});
    availableHorarios.value = horarios.map(horario => ({
      horario,
      disponible: checkDisponibilidad(selectedDia.value, horario, selectedCancha.value)
    }));
  } else {
    availableHorarios.value = [];
  }
  console.log('availableHorarios', availableHorarios)
}

function checkDisponibilidad(fecha, hora, cancha) {
  const reservas = cancha.reservas?.[fecha] || [];
  return !reservas.includes(hora);
}

watch([selectedCancha, selectedDia], handleCanchaChange);

</script>

<template>
  <HeaderPage route="/home" title="Crear partido" />
  <Section>
    <div class="col-12">
      <form action="#" method="POST" @submit.prevent="handleSubmit">
        <h3 class="mb-3">Datos del partido</h3>
        <div class="mb-3">
          <input type="text" class="form-control" id="nombre" placeholder="Nombre del partido"
            v-model="fields.nombre" />
        </div>
        <div class="mb-3">
          <select id="complejo" class="form-select" v-model="selectedCancha">
            <option disabled value="">Complejo</option>
            <option v-for="cancha in canchas" :value="cancha" :key="cancha.id">
              {{ cancha.nombre }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <input type="date" id="fecha" v-model="selectedDia" :min="minDate">
        </div>
        <div class="mb-3">
          <select id="hora" class="form-select" v-model="fields.hora">
            <option disabled value="">Hora</option>
            <option v-for="horario in availableHorarios" :value="horario.horario" :key="horario.horario"
              :disabled="!horario.disponible">
              {{ horario.horario }} ({{ horario.disponible ? 'Disponible' : 'No Disponible' }})
            </option>
          </select>
        </div>
        <div class="mb-3">
          <select id="cantidadJ" class="form-select" v-model="fields.cantidadJ">
            <option disabled value="">Cantidad de jugadores</option>
            <option value="5">5 vs 5</option>
            <option value="6">6 vs 6</option>
            <option value="7">7 vs 7</option>
            <option value="8">8 vs 8</option>
            <option value="9">9 vs 9</option>
            <option value="10">10 vs 10</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="cambios" class="form-select" v-model="fields.cambios">
            <option disabled value="">Cambios</option>
            <option>Con</option>
            <option>Sin</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="tipo" class="form-select" v-model="fields.tipo">
            <option disabled value="">Tipo de partido</option>
            <option>Femenino</option>
            <option>Masculino</option>
            <option>Mixto</option>
          </select>
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" id="valorCancha" placeholder="Valor total de la cancha"
            v-model="fields.valorCancha" />
        </div>
        <button type="submit" class="btn cargar-button fw-semibold text-white py-2">
          CREAR PARTIDO
        </button>
      </form>
    </div>
  </Section>
</template>

<style scoped>
img {
  width: 80%;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 0.2px solid rgb(203, 203, 203);
  border-radius: 20px;
}

.cargar-button {
  border-radius: 18px;
  background-color: #73a812;
  width: 100%;
  display: inline-block;
}
</style>

<!-- 
<template>
  <HeaderPage route="/home" title="Crear partido"/>
  <Section>
    <div class="col-12">
      <form action="#" method="POST" @submit.prevent="handleSubmit">
        <h3 class="mb-3">Datos del partido</h3>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="nombre"
            placeholder="Nombre del partido"
            v-model="fields.nombre"
          />
        </div>
        <div class="mb-3">
          <select id="complejo" class="form-select" v-model="selectedCancha">
            <option disabled value="">Complejo</option>
            <option
              v-for="cancha in canchas"
              :value="cancha"
              :key="cancha.nombre"
            >
              {{ cancha.nombre }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <input type="date" id="fecha" v-model="selectedDia" :min="minDate">
        </div>
        <div class="mb-3">
          <select id="hora" class="form-select" v-model="fields.hora">
            <option disabled value="">Hora</option>
            <option v-for="(horario,index) in selectedCancha?.horarios" :value="index" :key="index">
              {{ index }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <select id="cantidadJ" class="form-select" v-model="fields.cantidadJ">
            <option disabled value="">Cantidad de jugadores</option>
            <option value="5">5 vs 5</option>
            <option value="6">6 vs 6</option>
            <option value="7">7 vs 7</option>
            <option value="8">8 vs 8</option>
            <option value="9">9 vs 9</option>
            <option value="10">10 vs 10</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="cambios" class="form-select" v-model="fields.cambios">
            <option disabled value="">Cambios</option>
            <option>Con</option>
            <option>Sin</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="tipo" class="form-select" v-model="fields.tipo">
            <option disabled value="">Tipo de partido</option>
            <option>Femenino</option>
            <option>Masculino</option>
            <option>Mixto</option>
          </select>
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="valorCancha"
            placeholder="Valor total de la cancha"
            v-model="fields.valorCancha"
          />
        </div>
        <button
          type="submit"
          class="btn cargar-button fw-semibold text-white py-2"
        >
          CREAR PARTIDO
        </button>
      </form>
    </div>
  </Section>
  </template>

<style scoped>
img {
  width: 80%;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 0.2px solid rgb(203, 203, 203);
  border-radius: 20px;
}
.cargar-button {
  border-radius: 18px;
  background-color: #73a812;
  width: 100%;
  display: inline-block;
}
</style> -->

<!-- <script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { useRouter } from "vue-router";
import { cargarPartido } from "../services/partidos.js";
import { getCanchas } from "../../canchas/services/canchas.js";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
const { fields, user, loading, handleSubmit } = useCargaPartido();
const canchas = ref([]);

function useCargaPartido() {
  const { user } = useAuth();
  const router = useRouter();

  const fields = ref({
    nombre: "",
    complejo: null,
    fecha: "",
    hora: "",
    cantidadJ: 0,
    contadorInscriptos: [],
    totalJ: 0,
    cambios: "",
    tipo: "",
    usuarioCreador: "",
    valorCancha: "",
  });

  const loading = ref(false);

  async function handleSubmit() {
    loading.value = true;

    await cargarPartido({
      ...fields.value,
      userId: user.value.id,
      usuarioCreador: user.value.displayName,
    });

    loading.value = false;

    router.push("/home");
  }

  return {
    fields,
    user,
    loading,
    handleSubmit,
  };
}

onMounted(async () => {
  try {
    const canchasData = await getCanchas();
    canchas.value = canchasData;
    fields.complejo = canchas.value;
    console.log('complejos',fields.complejo)
  } catch (error) {
    console.error(error.message);
  }
});
</script>

<template>
  <HeaderPage route="/home" title="Crear partido"/>
  <Section>
    <div class="col-12">
      <form action="#" method="POST" @submit.prevent="handleSubmit">
        <h3 class="mb-3">Datos del partido</h3>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="nombre"
            placeholder="Nombre del partido"
            v-model="fields.nombre"
          />
        </div>
        <div class="mb-3">
            <select id="complejo" class="form-select" v-model="fields.complejo">
                <option disabled value="">Complejo</option>
                <option
                    v-for="cancha in canchas"
                    :value="cancha"
                    :key="cancha.nombre"
                >
                    {{ cancha.nombre }}
                </option>
            </select>
        </div>
        <div class="mb-3">
          <input
            type="date"
            class="form-control"
            id="fecha"
            placeholder="Fecha del partido"
            v-model="fields.fecha"
          />
        </div>
        <div class="mb-3">
            <select v-model="fields.hora">
                <option value="">Selecciona un rango horario</option>
                <option
                    v-for="cancha in canchas"
                    :value="cancha"
                    :key="cancha.nombre"
                >
                    {{ cancha.nombre }}
                </option>
            </select>
        </div>
        <div class="mb-3">
          <select id="cantidadJ" class="form-select" v-model="fields.cantidadJ">
            <option disabled value="">Cantidad de jugadores</option>
            <option value="5">5 vs 5</option>
            <option value="6">6 vs 6</option>
            <option value="7">7 vs 7</option>
            <option value="8">8 vs 8</option>
            <option value="9">9 vs 9</option>
            <option value="10">10 vs 10</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="cambios" class="form-select" v-model="fields.cambios">
            <option disabled value="">Cambios</option>
            <option>Con</option>
            <option>Sin</option>
          </select>
        </div>
        <div class="mb-3">
          <select id="tipo" class="form-select" v-model="fields.tipo">
            <option disabled value="">Tipo de partido</option>
            <option>Femenino</option>
            <option>Masculino</option>
            <option>Mixto</option>
          </select>
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="valorCancha"
            placeholder="Valor total de la cancha"
            v-model="fields.valorCancha"
          />
        </div>
        <button
          type="submit"
          class="btn cargar-button fw-semibold text-white py-2"
        >
          CREAR PARTIDO
        </button>
      </form>
    </div>
  </Section>
</template>

<style scoped>
img {
  width: 80%;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 0.2px solid rgb(203, 203, 203);
  border-radius: 20px;
}
.cargar-button {
  border-radius: 18px;
  background-color: #73a812;
  width: 100%;
  display: inline-block;
}
</style> -->
