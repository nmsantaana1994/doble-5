import {
    collection,
    query,
    getDocs,
    where
  } from "@firebase/firestore";
  import { db } from "../../services/firebase";



export async function getPartidoByNombre(nombre) {
    const q = query(collection(db, "partidos"), where("nombre", "==", nombre));
    const snapshot = await getDocs(q);

  if (snapshot.empty) {
      throw new Error("No existe el partido con el nombre proporcionado");
  }

  const partido = snapshot.docs[0].data();
  return partido;
}

export async function actualizarListaInscriptos(nombre, nuevaLista) {
  try {
    const partidosRef = collection(db, "partidos");
    const q = query(partidosRef, where("nombre", "==", nombre));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (partido) => {
      const partidoRef = doc(db, "partidos", partido.id);
      await updateDoc(partidoRef, {
        contadorInscriptos: nuevaLista,
      });
      console.log("Lista actualizada correctamente");
      console.log("Usuarios inscriptos en partido:", nuevaLista);

      // Agregar listener para cambios en este documento específico
      onSnapshot(partidoRef, (docSnapshot) => {
        const updatedPartido = docSnapshot.data();
        console.log("Cambios detectados:", updatedPartido);
        // Puedes actualizar la interfaz o realizar acciones adicionales aquí
      });
    });
  } catch (error) {
    console.error("Error al actualizar contador de inscriptos:", error);
  }
}
