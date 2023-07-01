import {
    collection,
    query,
    getDocs,
    where
  } from "@firebase/firestore";
  import { db } from "./firebase";



export async function getPartidoByNombre(nombre) {
    const q = query(collection(db, "partidos"), where("nombre", "==", nombre));
    const snapshot = await getDocs(q);

  if (snapshot.empty) {
      throw new Error("No existe el partido con el nombre proporcionado");
  }

  const partido = snapshot.docs[0].data();
  return partido;
}
