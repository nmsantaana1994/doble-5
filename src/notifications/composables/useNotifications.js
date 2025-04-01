// import { ref } from "vue";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "../../services/firebase";

// export function useNotificaciones(userId) {
//   const notificaciones = ref([]);

//   const cargarNotificaciones = () => {
//     if (!userId) return;

//     const q = query(
//       collection(db, "notificaciones"),
//       where("userId", "==", userId)
//     );

//     onSnapshot(q, (snapshot) => {
//       notificaciones.value = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log("notificaciones", notificaciones.value[0].mensaje);
//     });
//   };

//   // Cargar notificaciones inmediatamente
//   cargarNotificaciones();

//   return {
//     notificaciones,
//   };
// }

import { ref } from "vue";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";

export function useNotificaciones(userId) {
  const notificaciones = ref([]); // Mantén esto como un ref reactivo

  const cargarNotificaciones = () => {
    if (!userId) {
      console.error("El userId no está definido. No se pueden cargar las notificaciones.");
      return;
    }

    const q = query(
      collection(db, "notificaciones"),
      where("userId", "==", userId), // Filtrar por el usuario autenticado
      // orderBy("created_at", "desc") // Ordenar por fecha
    );

    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        notificaciones.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Notificaciones obtenidas:", notificaciones.value);
      } else {
        console.warn("No se encontraron notificaciones para el usuario:", userId);
        notificaciones.value = [];
      }
    }, (error) => {
      console.error("Error al obtener las notificaciones:", error);
    });
  };

  // Cargar notificaciones inmediatamente
  cargarNotificaciones();

  return {
    notificaciones,
  };
}
