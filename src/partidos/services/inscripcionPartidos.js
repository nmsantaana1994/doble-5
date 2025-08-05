import { collection, query, getDocs, where } from "@firebase/firestore";
import { db } from "../../services/firebase";
import { notificationProvider } from "../../symbols/symbols";
import { inject } from "vue";
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);

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
    clearFeedbackMessage();
    const partidosRef = collection(db, "partidos");
    const q = query(partidosRef, where("nombre", "==", nombre));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (partido) => {
      const partidoRef = doc(db, "partidos", partido.id);
      await updateDoc(partidoRef, {
        contadorInscriptos: nuevaLista,
      });

      onSnapshot(partidoRef, (docSnapshot) => {
        const updatedPartido = docSnapshot.data();
        setFeedbackMessage({
          type: "success",
          message: "Usuario inscripto correctamente",
        });
      });
    });
  } catch (error) {
    console.error("Error al actualizar contador de inscriptos:", error);
    setFeedbackMessage({ type: "error", message: error });
  }
}
