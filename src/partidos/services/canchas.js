import { getDoc, doc, updateDoc } from "@firebase/firestore";
import { db } from "../../services/firebase";

export async function getCanchaById(idCancha) {
  try {
    const canchaDoc = await getDoc(doc(db, "admin-canchas", idCancha));
    if (canchaDoc.exists()) {
      // El documento existe, devolver los datos del partido
      return canchaDoc.data();
    } else {
      // El documento no existe
      console.log("No se encontró la cancha con el ID proporcionado.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la cancha:", error);
    throw error;
  }
}

export async function actualizarCancha(idCancha, reservas) {
  try {
    let cancha = await getCanchaById(idCancha);

    // Si no hay reservas para ese día, inicializalo
    if (!cancha.reservas[reservas.fecha]) {
      cancha.reservas[reservas.fecha] = {};
    }

    // Verificar si ya existe una reserva para esa hora
    const reservaExistente = cancha.reservas[reservas.fecha][reservas.hora];
    if (reservaExistente && reservaExistente.disponible === false) {
      throw new Error(
        "Fecha y hora ya reservadas anteriormente, intente otra fecha u hora"
      );
    }

    // Agregar o actualizar la reserva
    cancha.reservas[reservas.fecha][reservas.hora] = {
      disponible: false, // marcar como ocupada
    };
    await actualizarListaReservas(idCancha, cancha);
    console.log("cancha actualizada correctamente.");
  } catch (error) {
    console.error("Error al actualizar la cancha:", error);
    throw error;
  }
}

export async function actualizarListaReservas(idCancha, cancha) {
  try {
    const canchaRef = doc(db, "admin-canchas", idCancha);
    await updateDoc(canchaRef, {
      reservas: cancha.reservas,
    });
    console.log("Contenido que se va a guardar:", {
      reservas: cancha.reservas,
      horarios: cancha.horarios,
    });
    console.log("cancha actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar las reservas de la cancha:", error);
    throw error;
  }
}
