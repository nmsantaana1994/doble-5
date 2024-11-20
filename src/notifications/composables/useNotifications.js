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
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

export function useNotificaciones(userId) {
  const notificaciones = ref([]); // Mantén esto como un ref reactivo

  const cargarNotificaciones = () => {
    if (!userId) return; // Asegúrate de tener el `userId` antes de ejecutar la consulta

    const q = query(
      collection(db, "notificaciones"),
      where("userId", "==", userId)
    );

    onSnapshot(q, (snapshot) => {
      notificaciones.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  };

  // Cargar notificaciones inmediatamente
  cargarNotificaciones();

  return {
    notificaciones, // Retornar el `ref` reactivo, no su valor
  };
}
