<script setup>
import {ref} from "vue";
import { useAuth } from "../composition/useAuth.js";
import { useRouter } from "vue-router";
import { cargarPartido } from "../services/partidos.js";

//const {user} = useAuth();
const {fields, user, loading, handleSubmit} = useCargaPartido();

function useCargaPartido() {
    const {user} = useAuth();
    const router = useRouter();

    const fields = ref({
        nombre: "",
        complejo: "",
        fecha: "",
        hora: "",
        cantidadJ: "",
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
            id,
        });

        loading.value = false;

        router.push('/home');
    }

    return {
        fields,
        user,
        loading,
        handleSubmit
    }
}
</script>

<template>
    <section class="p-3">
        <h2>Crear partido</h2>
    
        <div class="row">
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
                    <!-- <input type="text" class="form-control" id="nombre" placeholder="Nombre del partido"> -->
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
                        <option>5 vs 5</option>
                        <option>6 vs 6</option>
                        <option>7 vs 7</option>
                        <option>8 vs 8</option>
                        <option>9 vs 9</option>
                        <option>10 vs 10</option>
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
                <button type="submit" class="btn btn-secondary">Cargar</button>
            </form>
        </div>
    </section>
</template>