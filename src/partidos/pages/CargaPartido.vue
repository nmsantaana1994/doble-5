<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { useRouter } from "vue-router";
import { cargarPartido } from "../services/partidos.js";
import { getCanchas } from "../../canchas/services/canchas.js";

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
    valorCancha: "",
  });

  const loading = ref(false);

  async function handleSubmit() {
    loading.value = true;

    await cargarPartido({
      ...fields.value,
      userId: user.value.id,
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
  <section class="row">
    <div class="col-3 d-flex justify-content-center align-items-center">
      <router-link :to="`/home`">
        <img src="../assets/img/flecha-izquierda.png" />
        <i class="fi fi-sr-angle-left"></i>
      </router-link>
    </div>
    <div class="col-9 d-flex align-items-center">
      <h1 class="text-center">Crear partido</h1>
    </div>
  </section>
  <section class="row p-3">
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
                <option value="5-6">5:00 - 6:00</option>
                <option value="6-7">6:00 - 7:00</option>
                <option value="7-8">7:00 - 8:00</option>
                <!-- Agrega más opciones según sea necesario -->
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
  </section>
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
