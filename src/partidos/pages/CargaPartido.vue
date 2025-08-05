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
import Loading from "../../components/Loading.vue";

const { feedback, setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);
const { showModal } = inject(modalProvider);
const { fields, user, loading, handleSubmit } = useCargaPartido();
const canchas = ref([]);
const selectedDia = ref("");
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
    tipo: "",
    usuarioCreador: "",
    estado: "activo",
  });

  const loading = ref(false);

  async function handleSubmit() {
    try {
      clearFeedbackMessage();
      loading.value = true;

      let reserva = {
        fecha: selectedDia.value,
        hora: fields.value.hora,
      };
      const partido = await cargarPartido(
        {
          ...fields.value,
          userId: user.value.id,
          usuarioCreador: user.value.displayName,
          complejo: selectedCancha.value,
          fecha: selectedDia.value,
        },
        reserva
      );
      loading.value = false;
      setFeedbackMessage({
        type: "success",
        message: "Partido creado correctamente",
      });
      const result = await showModal({
        title: "Partido creado",
        bodyText: "¿Desea sumarse como jugador a este partido?",
        closeButtonText: "NO",
        saveButtonText: "SI",
      });
      if (result) {
        try {
          clearFeedbackMessage();
          if (partido.id) {
            await inscribirPartido(partido.id, user);
            setFeedbackMessage({
              type: "success",
              message: "Usuario inscripto correctamente.",
            });
            router.push(`/info-partido/${partido.id}`);
          } else {
            console.error("No se ha encontrado el partido para inscribirse.");
          }
        } catch (error) {
          console.error("Error al inscribirse al partido:", error);
          setFeedbackMessage({ type: "error", message: error });
        }
      } else if (!result) {
        router.push("/home");
      } else if (result === "closex") {
        router.push("/home");
        return;
      }
    } catch (error) {
      setFeedbackMessage({
        type: "error",
        message: error.message || "Error al crear el partido",
      });
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
  } catch (error) {
    console.error(error.message);
  }
});

// Calcula la fecha mínima estableciendo la fecha actual
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const cantidadJugadoresOptions = computed(() => {
  if (selectedCancha.value && selectedCancha.value.prices) {
    return Object.keys(selectedCancha.value.prices);
  }
  return [];
});

function handleCanchaChange() {
  if (selectedCancha.value && selectedDia.value) {
    const horarios = Object.keys(selectedCancha.value.horarios || {});
    availableHorarios.value = horarios.map((horario) => ({
      horario,
      disponible: checkDisponibilidad(
        selectedDia.value,
        horario,
        selectedCancha.value
      ),
    }));
  } else {
    availableHorarios.value = [];
  }
}

const isFormValid = computed(() => {
  return (
    fields.value.nombre &&
    selectedCancha.value &&
    selectedDia.value &&
    fields.value.hora &&
    fields.value.cantidadJ &&
    fields.value.tipo &&
    fields.value.valorCancha
  );
});

watch([() => fields.value.cantidadJ, selectedCancha], ([cantidadJ, cancha]) => {
  if (cancha && cancha.prices && cantidadJ) {
    const precio = cancha.prices[cantidadJ];
    if (precio) {
      fields.value.valorCancha = precio;
    } else {
      fields.value.valorCancha = "";
    }
  }
});

function checkDisponibilidad(fecha, hora, cancha) {
  const reservasDelDia = cancha.reservas?.[fecha] || {};
  const reserva = reservasDelDia[hora];
  return reserva ? reserva.disponible !== false : true;
}

watch([selectedCancha, selectedDia], handleCanchaChange);
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage route="/home" title="Crear partido" :hasBackground="false" />
  <Section>
    <div class="col-12 px-3">
      <form action="#" method="POST" @submit.prevent="handleSubmit">
        <h3 class="mb-3">Datos del encuentro</h3>
        <p class="border m-line w-15 mb-4"></p>
        <!-- 1. Nombre del partido (siempre habilitado) -->
        <div class="mb-3">
          <label for="nombre">Nombre del partido:</label>
          <input
            type="text"
            class="form-control"
            id="nombre"
            placeholder="Nombre"
            v-model="fields.nombre"
          />
        </div>

        <!-- 2. Complejo (habilitado solo si hay nombre) -->
        <div class="mb-3">
          <label for="complejo">Complejo:</label>

          <select
            id="complejo"
            class="form-select"
            v-model="selectedCancha"
            :disabled="!fields.nombre"
          >
            <option disabled value="">Complejo</option>
            <option v-for="cancha in canchas" :value="cancha" :key="cancha.id">
              {{ cancha.name }}
            </option>
          </select>
        </div>

        <!-- 3. Fecha (habilitado solo si hay complejo) -->
        <div class="mb-3">
          <label for="fecha">Fecha:</label>

          <input
            type="date"
            id="fecha"
            v-model="selectedDia"
            :min="minDate"
            :disabled="!selectedCancha"
          />
        </div>

        <!-- 4. Hora (habilitado solo si hay fecha) -->
        <div class="mb-3">
          <label for="hora">Hora:</label>

          <select
            id="hora"
            class="form-select"
            v-model="fields.hora"
            :disabled="!selectedDia"
          >
            <option disabled value="">Hora</option>
            <option
              v-for="horario in availableHorarios"
              :value="horario.horario"
              :key="horario.horario"
              :disabled="!horario.disponible"
            >
              {{ horario.horario }} ({{
                horario.disponible ? "Disponible" : "No Disponible"
              }})
            </option>
          </select>
        </div>

        <!-- 5. Jugadores (habilitado solo si hay hora) -->
        <div class="mb-3">
          <label for="cantidadJ">Cantidad de jugadores:</label>

          <select
            id="cantidadJ"
            class="form-select"
            v-model="fields.cantidadJ"
            :disabled="!fields.hora"
          >
            <option disabled value="">Cantidad de jugadores</option>
            <option
              v-for="cantidad in cantidadJugadoresOptions"
              :value="cantidad"
              :key="cantidad"
            >
              {{ cantidad }} vs {{ cantidad }}
            </option>
          </select>
        </div>

        <!-- 7. Tipo (habilitado solo si hay cantidadJ) -->
        <div class="mb-3">
          <label for="tipo">Tipo:</label>

          <select
            id="tipo"
            class="form-select"
            v-model="fields.tipo"
            :disabled="!fields.cantidadJ"
          >
            <option disabled value="">Tipo de partido</option>
            <option>Femenino</option>
            <option>Masculino</option>
            <option>Mixto</option>
          </select>
        </div>

        <!-- 8. Valor cancha (calculado, solo visible, no editable) -->
        <div class="mb-3">
          <label for="valorCancha"
            >Valor total de la cancha: ${{ fields.valorCancha }}</label
          >
        </div>
        <button
          type="submit"
          class="btn cargar-button fw-semibold text-white py-2"
          :disabled="!isFormValid"
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

.w-15 {
  width: 15%;
}

.m-line {
  margin-left: 0rem;
  border-color: #5d880d !important;
  border-radius: 25px;
  height: 3px;
  background-color: #5d880d;
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
label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 900;
}
</style>
