import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";

export const createNotification = async (
  userId,
  message,
  tipo = null,
  referenciaId = null,
  ruta = null
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) return;

    const settings = userSnap.data().settings?.notifications || {};

    if (tipo && settings[tipo] === false) return; // no crear si está desactivado

    const notificacionesRef = collection(db, "notificaciones");
    await addDoc(notificacionesRef, {
      userId,
      mensaje: message,
      leida: false,
      tipo,
      referenciaId,
      ruta,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al crear la notificación:", error);
  }
};

// // Función para crear una notificación
// export const createNotification = async (userId, message, tipo = null, referenciaId = null, ruta = null) => {
//     try {
//         const notificacionesRef = collection(db, "notificaciones");
//         await addDoc(notificacionesRef, {
//             userId,
//             mensaje: message, // Mensaje claro y específico
//             leida: false, // Agregar el campo `leida` como false por defecto
//             tipo,
//             referenciaId,
//             ruta,
//             created_at: serverTimestamp(),
//         });
//     } catch (error) {
//         console.error("Error al crear la notificación:", error);
//     }
// }

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
        callback(notificaciones);
      } else {
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
