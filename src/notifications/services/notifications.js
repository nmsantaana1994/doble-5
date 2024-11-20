import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";

export const agregarNotificacion = async (mensaje, userId) => {
  await addDoc(collection(db, "notificaciones"), {
    mensaje,
    userId,
    leido: false,
    fecha: new Date(),
  });
};
