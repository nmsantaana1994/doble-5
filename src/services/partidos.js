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
} from "@firebase/firestore";
import { db } from "./firebase";

export async function cargarPartido(
  data /*{nombre, complejo, fecha, hora, cantidadJ, cambios, tipo, valorCancha}*/
) {
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

export async function getPartidos() {
  const q = collection(db, "partidos");
  const snapshot = await getDocs(q);
  const partidos = [];
  snapshot.forEach((doc) => {
    partidos.push({
      id: doc.id,
      ...doc.data(),
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

// export async function inscribirPartido(idPartido, usuarioInscripto) {
//   let partido = await getPartidoById(idPartido);
//   console.log(partido);
//   partido.contadorInscriptos.push(usuarioInscripto.displayName);

//   console.log("desde servicio", partido.contadorInscriptos);

//   actualizarListaInscriptos(idPartido,partido.contadorInscriptos);
// }

export async function inscribirPartido(idPartido, usuarioInscripto) {
  try {
    let partido = await getPartidoById(idPartido);
    console.log(partido);
    let usuario = {
      uid: usuarioInscripto.uid,
      nombre: usuarioInscripto.displayName,
    };
    // Verificar si el usuario ya está inscrito en el partido
    if (partido.contadorInscriptos.includes(usuario)) {
      throw new Error("El usuario ya está inscrito en este partido.");
    }

    // Si el usuario no está inscrito, agregarlo a la lista de inscritos
    partido.contadorInscriptos.push(usuario);
    await actualizarListaInscriptos(idPartido, partido.contadorInscriptos);
    console.log("Usuario inscrito correctamente.");
  } catch (error) {
    console.error("Error al inscribirse al partido:", error);
    throw error;
  }
}

export async function actualizarListaInscriptos(idPartido, nuevaLista) {
  try {
    // Obtener referencia al documento del partido específico usando el ID proporcionado
    const partidoRef = doc(db, "partidos", idPartido);
    await updateDoc(partidoRef, {
      contadorInscriptos: nuevaLista,
    });
    console.log("Lista actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar contador de inscriptos:", error);
    throw error;
  }
}
