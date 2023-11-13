import { db } from "./firebase";
import { collection, doc, updateDoc, arrayUnion, arrayRemove, addDoc, getDocs, getDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

// Función para publicar una nueva publicación
export async function publishPost(postData, userId) {
    try {
        const publicacionesRef = collection(db, 'publicaciones');
  
        await addDoc(publicacionesRef, {
            ...postData,
            likes: postData.likes || [],
            comments: postData.comments || [],
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

// Función para obtener una publicación por su ID
export async function getPostById(postId) {
    try {
        const postRef = doc(db, "publicaciones", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
            return { id: postSnapshot.id, ...postSnapshot.data() };
        } else {
            throw new Error("La publicación no existe.");
        }
    } catch (error) {
        console.error("Error al obtener la publicación por ID:", error);
        throw error;
    }
}

// Esta función actualiza los comentarios de una publicación en la base de datos
export const updatePostComments = async (postId, comments) => {
    try {
        await db.collection('publicaciones').doc(postId).update({
            comments: comments,
        });
    
        console.log('Comentarios actualizados con éxito.');
    } catch (error) {
        console.error('Error al actualizar comentarios:', error);
        throw error;
    }
};

// Función para agregar un "Me gusta" a una publicación
export async function addLike(postId, userId) {
    try {
        const postRef = doc(db, "publicaciones", postId);

        await updateDoc(postRef, {
            likes: arrayUnion(userId),
        });
    } catch (error) {
        console.error("Error al agregar el 'Me gusta':", error);
        throw error;
    }
}
  
// Función para quitar un "Me gusta" de una publicación
export async function removeLike(postId, userId) {
    try {
        const postRef = doc(db, "publicaciones", postId);

        await updateDoc(postRef, {
            likes: arrayRemove(userId),
        });
    } catch (error) {
        console.error("Error al quitar el 'Me gusta':", error);
        throw error;
    }
}