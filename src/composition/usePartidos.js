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
        try {
            const partidoData = await getPartidoByNombre(nombre);
            console.log('partido con filtro', partidoData)
            partido.value.nombre = partidoData.nombre;
            partido.value.complejo = partidoData.complejo;
            partido.value.fecha = partidoData.fecha;
            partido.value.hora = partidoData.hora;
            partido.value.cantidadJ = partidoData.cantidadJ;
            partido.value.cambios = partidoData.cambios;
            partido.value.tipo = partidoData.tipo;
            partido.value.valorCancha = partidoData.valorCancha;
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
