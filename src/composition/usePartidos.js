import { ref } from "vue";
import { getPartidoByNombre } from "../services/partidos.js";

export function usePartido(nombre) {
    const partido = ref({
            nombre: null,
            complejo: null,
            fecha: null,
            hora: null,
            cantidadJ: null,
            cambios: null,
            tipo: null,
            valorCancha: null,
    });

    const loading = ref(true);

    loadPartido();

    async function loadPartido() {
        const partidoData = await getPartidoByNombre(nombre);
        console.log(partidoData)
        partido.value = partidoData;
        loading.value = false;
    }

    return {
        partido,
        loading,
    }
}