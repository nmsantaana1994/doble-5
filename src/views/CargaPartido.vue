<script setup>
import { ref } from "vue";
import { useAuth } from "../composition/useAuth.js";
import { useRouter } from "vue-router";
import { cargarPartido } from "../services/partidos.js";

//const {user} = useAuth();
const { fields, user, loading, handleSubmit } = useCargaPartido();

function useCargaPartido() {
    const {user} = useAuth();
    // const userId = user.value.uid;
    const router = useRouter();

    const fields = ref({
        nombre: "",
        complejo: "",
        fecha: "",
        hora: "",
        cantidadJ: 0,
        contadorInscriptos: [],
        totalJ: 0,
        //vacantes: "",
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
    <section class=" row p-3">
        <div class="col-12">
            <form
                action="#"
                method="POST"
                @submit.prevent="handleSubmit"
            >
                <h3 class="mb-3">Datos del partido</h3>
                <div class="mb-3">
                    <input
                        type="text"
                        class="form-control"
                        id="nombre"
                        placeholder="Nombre del partido"
                        v-model="fields.nombre"
                    >
                </div>
                <div class="mb-3">
                    <select
                        id="complejo"
                        class="form-select"
                        v-model="fields.complejo"
                    >
                        <option disabled value="">Complejo</option>
                        <option>Cancha 1</option>
                        <option>Cancha 2</option>
                        <option>Cancha 3</option>
                    </select>
                </div>
                <div class="mb-3">
                    <input
                        type="date"
                        class="form-control"
                        id="fecha"
                        placeholder="Fecha del partido"
                        v-model="fields.fecha"
                    >    
                </div>
                <div class="mb-3">
                    <input
                        type="time"
                        class="form-control"
                        id="hora"
                        placeholder="Hora del partido"
                        v-model="fields.hora"
                    >
                </div>
                <div class="mb-3">
                    <select
                        id="cantidadJ"
                        class="form-select"
                        v-model="fields.cantidadJ"
                    >
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
                    <select
                        id="cambios"
                        class="form-select"
                        v-model="fields.cambios"
                    >
                        <option disabled value="">Cambios</option>
                        <option>Con</option>
                        <option>Sin</option>
                    </select>
                </div>
                <div class="mb-3">
                    <select
                        id="tipo"
                        class="form-select"
                        v-model="fields.tipo"
                    >
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
                    >
                </div>
                <button type="submit" class="btn cargar-button fw-semibold text-white py-2">CREAR PARTIDO</button>
            </form>
        </div>
  </section>
</template>

<style scoped>
    img {
        width: 80%;
    }

    form{
        display: flex;
        flex-direction: column;
    }

    input, select{
        width: 100%;
        padding: .5rem;
        border: .2px solid rgb(203, 203, 203);
        border-radius: 20px;
    }
    .cargar-button {
        border-radius: 18px;
        background-color: #73a812;
        width: 100%;
        display: inline-block;
    }
</style>