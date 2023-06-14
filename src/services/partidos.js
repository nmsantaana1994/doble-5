import { doc, collection, serverTimestamp, setDoc, addDoc } from "@firebase/firestore";
import { db } from "./firebase";

export async function cargarPartido(data) {
    const partidoRef = collection(db, "partidos");

    try {
        await addDoc(partidoRef, {
          ...data,
          created_at: serverTimestamp(),
        });
      } catch (err) {
        console.error("[partidos.js cargaPartido] Ocurrió un error al cargar el partido.", err);
        throw err;
      }
}