import { db } from "./firebase";
import { collection, doc, updateDoc, arrayUnion, arrayRemove, addDoc, getDocs, getDoc, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";

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

export async function addComment(postId, user, newComment) {
    try {
        const postRef = doc(db, "publicaciones", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
            const post = { id: postSnapshot.id, ...postSnapshot.data() };

            // Agregar el nuevo comentario a la publicación
            post.comments.push({
                userId: user.id,
                userDisplayName: user.displayName,
                content: newComment,
                created_at: Timestamp.now(),
            });

            // Actualizar la publicación en la base de datos
            await updateDoc(postRef, {
                comments: post.comments,
            });

            // Devolver la publicación actualizada
            return post;

            // console.log('Comentario: ', post.comments);
            // console.log('Comentario agregado con éxito.');
        } else {
            throw new Error("La publicación no existe.");
        }
    } catch (error) {
        console.error("Error al agregar el comentario:", error);
        throw error;
    }
}


// Función para manejar tanto la adición como la eliminación del "Me gusta"
export async function toggleLike(postId, userId) {
    try {
        const postRef = doc(db, "publicaciones", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
            const post = { id: postSnapshot.id, ...postSnapshot.data() };

            // Verifica si el usuario ya dio like
            const userLiked = post.likes.includes(userId);

            // Agregar o quitar el "Me gusta" según el estado actual
            if (userLiked) {
                // Quitar el "Me gusta"
                post.likes = post.likes.filter((likedUserId) => likedUserId !== userId);
                await removeLike(postId, userId);
            } else {
                // Agregar el "Me gusta"
                post.likes.push(userId);
                await addLike(postId, userId);
            }
            
            // Actualizar el estado del "Me gusta" en la publicación
            post.liked = !userLiked;

            // Actualizar la publicación en la base de datos
            await updateDoc(postRef, {
                likes: post.likes,
            });

            // Devolver la publicación actualizada
            return post;
        } else {
            throw new Error("La publicación no existe.");
        }
    } catch (error) {
        console.error("Error al manejar el 'Me gusta':", error);
        throw error;
    }
}


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