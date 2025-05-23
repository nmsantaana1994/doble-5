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
  onSnapshot,
} from "@firebase/firestore";
import { db } from "../../services/firebase";
import { actualizarCancha } from "./canchas";
export async function cargarPartido(data, reserva) {
  try {
    const partidoRef = collection(db, "partidos");
    await actualizarCancha(data.complejo.id, reserva);
    return addDoc(partidoRef, {
      ...data,
      created_at: serverTimestamp(),
    });
  } catch (err) {
    console.log(err);
    throw err;
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

export async function inscribirPartido(idPartido, usuarioInscripto) {
  console.log(idPartido, usuarioInscripto);
  try {
    let partido = await getPartidoById(idPartido);
    let usuario = {
      uid: usuarioInscripto.value.id,
      nombre: usuarioInscripto.value.displayName,
      image: usuarioInscripto.value.photoURL,
    };
    // Verificar si el usuario ya está inscrito en el partido
    const usuarioYaInscrito = partido.contadorInscriptos.some(
      (inscrito) => inscrito.uid === usuario.uid
    );
    if (usuarioYaInscrito && partido.contadorInscriptos.length < 10) {
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

export async function obtenerRefDocumento(db, coleccion, documento) {
  return doc(db, coleccion, documento);
}

export async function eliminarJugadorDePartido(usuarioaEliminar, idPartido) {
  try {
    let partido = await getPartidoById(idPartido);
    let usuario = {
      uid: usuarioaEliminar,
    };
    const nuevoListado = partido.contadorInscriptos.filter(
      (elemento) => elemento.uid !== usuario.uid
    );

    await actualizarListaInscriptos(idPartido, nuevoListado);
    console.log("Usuario eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar al jugador del partido:", error);
    throw error;
  }
}

export async function eliminarPartidoCreado() {
  try {
    let partidos = await getPartidos();
    const nuevoListado = partidos.filter(
      (elemento) => elemento.uid !== usuario.uid
    );

    // await actualizarListaInscriptos(idPartido, nuevoListado);
    // console.log("Usuario eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar al jugador del partido:", error);
    throw error;
  }
}
