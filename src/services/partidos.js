import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  getDocs,
  getDoc,
  where,
  doc,
  updateDoc
} from "@firebase/firestore";
import { db } from "./firebase";

export async function cargarPartido(data /*{nombre, complejo, fecha, hora, cantidadJ, cambios, tipo, valorCancha}*/) {
    try {
        const partidoRef = collection(db, "partidos");

        return addDoc(partidoRef, {
            ...data,
            // nombre,
            // complejo,
            // fecha,
            // hora,
            // cantidadJ,
            // cambios,
            // tipo,
            // valorCancha,
            created_at: serverTimestamp(),
        });
    } catch (err) {
        console.log(err);
    }
}

// export async function getPartidos() {
//     const q = query(collection(db, "partidos"));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc) => doc.data());
// }

export async function getPartidos() {
  const q = collection(db, "partidos");
  const snapshot = await getDocs(q);
  const partidos = [];
  snapshot.forEach((doc) => {
      partidos.push({
          id: doc.id,
          ...doc.data()
      });
  });
  return partidos;
}

export async function getPartidoById(idPartido) {
  try {
      const partidoDoc = await getDoc(doc(db, "partidos", idPartido));
      if (partidoDoc.exists()) {
          // El documento existe, devolver los datos del partido
          return partidoDoc.data();
      } else {
          // El documento no existe
          console.log("No se encontró el partido con el ID proporcionado.");
          return null;
      }
  } catch (error) {
      console.error("Error al obtener el partido:", error);
      throw error;
  }
}



export async function inscribirPartido(idPartido) {
    
}












// try {
//   const partidoRef = doc(db, "partidos", idPartido);
//   const partidoDoc = await getDoc(partidoRef);

//   if (!partidoDoc.exists()) {
//       throw new Error("No existe el partido con el ID proporcionado");
//   }

//   return { id: partidoDoc.id, ...partidoDoc.data() };
// } catch (error) {
//   console.error("Error al obtener el partido:", error);
//   throw error;
// }






















// export async function getPartidoById(idPartido) {
//   debugger
//   const partidoRef = doc(db, "partidos", idPartido);
//   const partidoDoc = await getDoc(partidoRef);

//   if (!partidoDoc.exists()) {
//       throw new Error("No existe el partido con el ID proporcionado");
//   }

//   return { id: partidoDoc.id, ...partidoDoc.data() };
// }

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
