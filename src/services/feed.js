import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";

// Función para publicar una nueva publicación
export async function publishPost(postData, userId) {
    try {
        const publicacionesRef = collection(db, 'publicaciones');
  
        await addDoc(publicacionesRef, {
            ...postData,
            // content: postData.content, // Contenido del post
            // userId: postData.userId, // ID del usuario
            created_at: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error al publicar la publicación:", error);
        throw error;
    }
}
  
// Función para obtener todas las publicaciones
export async function getPosts() {
    try {
        const publicacionesRef = collection(db, 'publicaciones');
        const q = query(publicacionesRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot;
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        throw error;
    }
}

export async function startRealtimePostListener(callback) {
    const postsRef = collection(db, "publicaciones");
    const q = query(postsRef, orderBy("timestamp", "desc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const newPosts = [];
        snapshot.forEach((doc) => {
            const postData = doc.data();
            newPosts.push({
                id: doc.id,
                userDisplayName: postData.userDisplayName,
                timestamp: postData.timestamp.toDate(),
                content: postData.content,
                // Otros campos que desees mostrar
            });
        });
    
        // Llama a la función de callback con los nuevos posts
        callback(newPosts);
    });
  
    return unsubscribe; // Para detener la escucha si es necesario
}