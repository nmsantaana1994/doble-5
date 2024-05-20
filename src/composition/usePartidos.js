import { ref } from "vue";
import {getPartidoById } from "../partidos/services/partidos.js";

export function usePartido(idPartido) {
    const partido = ref({
        id: null,
        nombre: null,
        complejo: null,
        fecha: null,
        hora: null,
        cantidadJ: null,
        cambios: null,
        tipo: null,
        userId: null,
        valorCancha: null,
        contadorInscriptos: [],
    });

    const loading = ref(true);

    loadPartido();

    async function loadPartido() {
        try {
            const partidoData = await getPartidoById(idPartido);
            partido.value = partidoData;
            loading.value = false;
        } catch (error) {
            console.error(error);
            loading.value = false;
        }
    }

    return {
        partido,
        loading,
    }
}
