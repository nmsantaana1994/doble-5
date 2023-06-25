import { doc, collection, serverTimestamp, setDoc, addDoc,query, getDocs} from "@firebase/firestore";
import { db } from "./firebase";


export async function cargarPartido(data/*{nombre, complejo, fecha, hora, cantidadJ, cambios, tipo, valorCancha}*/) {
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
        })
        
    } catch (err) {
        console.log(err);
    }
}

export async function getPartidos() {
    const q = query(collection(db,"partidos"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data());
  }