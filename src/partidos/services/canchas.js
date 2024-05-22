import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  getDocs,
  getDoc,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "../../services/firebase";

export async function getCanchaById(idCancha) {
  try {
    const canchaDoc = await getDoc(doc(db, "canchas", idCancha));
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
    // Verificar si ya hay una reserva anteriormente
    if (cancha.reservas[reservas.fecha]) {
      if (cancha.reservas[reservas.fecha] === reservas.hora) {
        throw new Error(
          "fecha y hora ya reservadas anteriormente, intente otra fecha u hora"
        );
      }
    }
    //   Si la reserva es valida, agregarlo al objeto de reservas
    cancha.reservas[reservas.fecha] = { hora: reservas.hora, disponible: true };

    if(cancha.horarios)
    await actualizarListaReservas(idCancha, cancha);
    console.log("cancha actualizada correctamente.");
  } catch (error) {
    console.error("Error al actualizar la cancha:", error);
    throw error;
  }
}

export async function actualizarListaReservas(idCancha, cancha) {
  try {
    const canchaRef = doc(db, "canchas", idCancha);
    await updateDoc(canchaRef, {
      reservas: cancha.reservas,
    });
    console.log("cancha actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar las reservas de la cancha:", error);
    throw error;
  }
}
