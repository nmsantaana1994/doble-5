import { addDoc, collection, doc, updateDoc, query, where, onSnapshot, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

// Agregar una nueva notificación
export const agregarNotificacion = async (mensaje, userId) => {
  await addDoc(collection(db, "notificaciones"), {
    mensaje,
    userId,
    leida: false,
    created_at: new Date(),
  });
};

// Obtener notificaciones en tiempo real
export const obtenerNotificaciones = (userId, callback) => {
  const q = query(
    collection(db, "notificaciones"),
    where("userId", "==", userId), // Filtrar por usuario
    orderBy("created_at", "desc") // Ordenar por fecha
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const notificaciones = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Notificaciones obtenidas desde Firebase:", notificaciones); // Depuración
        callback(notificaciones);
      } else {
        console.warn("No se encontraron notificaciones para el usuario:", userId);
        callback([]); // Devolver un array vacío si no hay notificaciones
      }
    },
    (error) => {
      console.error("Error al obtener las notificaciones:", error);
    }
  );
};

// Obtener el número de notificaciones no leídas en tiempo real
export const obtenerNumeroNotificacionesNoLeidas = (userId, callback) => {
  const q = query(
    collection(db, "notificaciones"),
    where("userId", "==", userId),
    where("leida", "==", false) // Filtrar solo las no leídas
  );

  return onSnapshot(q, (snapshot) => {
    console.log("Número de notificaciones no leídas:", snapshot.size); // Depuración
    callback(snapshot.size); // Devolver el número de documentos no leídos
  });
};

// Marcar una notificación como leída
export const marcarNotificacionComoLeida = async (notificacionId) => {
  try {
    const notificacionRef = doc(db, "notificaciones", notificacionId);
    await updateDoc(notificacionRef, { leida: true });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
  }
};

// Eliminar una notificación
export const eliminarNotificacion = async (notificacionId) => {
  try {
    const notificacionRef = doc(db, "notificaciones", notificacionId);
    await deleteDoc(notificacionRef);
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
  }
};
