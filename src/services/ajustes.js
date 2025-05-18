import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function getUserSettings(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.settings?.notifications || null;
        }
    } catch (error) {
        console.error("Error al obtener configuración de usuario", error);
        return null;
    }
}

export async function updateUserSettings(userId, settings) {
    try {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
            "settings.notifications": settings,
        });
    } catch (error) {
        console.error("Error actualizando ajustes de usuario", error);
    }
}
