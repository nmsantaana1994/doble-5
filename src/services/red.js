import { db } from "./firebase"; // Asegúrate de importar correctamente el archivo
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    onSnapshot,
} from "firebase/firestore";
import { getUserById } from "./users.js";

// Obtener seguidores de un usuario
export async function obtenerSeguidores(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const followers = userDoc.data().followers || [];
        const usuariosFollowers = [];

        for (const follower of followers) {
          const usuarioFollower = await getUserById(follower);
          usuariosFollowers.push(usuarioFollower);
        }

        return usuariosFollowers;
      } else {
        console.error('[red.js obtenerSeguidores] El usuario no existe:', userId);
        return [];
      }
    } catch (error) {
      console.error('[red.js obtenerSeguidores] Error:', error);
      return [];
    }
}

// Obtener usuarios seguidos por un usuario
export async function obtenerSiguiendo(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const following = userDoc.data().following || [];
        const usuariosFollowing = [];

        for (const follow of following) {
          const usuarioFollowing = await getUserById(follow);
          usuariosFollowing.push(usuarioFollowing);
        }
        
        return usuariosFollowing;
      } else {
        console.error('[red.js obtenerSiguiendo] El usuario no existe:', userId);
        return [];
      }
    } catch (error) {
      console.error('[red.js obtenerSiguiendo] Error:', error);
      return [];
    }
  }

// Obtener seguidores de un usuario y escuchar cambios en tiempo real
export function seguirCambioSeguidores(userId, callback) {
  const userRef = doc(db, 'users', userId);
  const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const followers = snapshot.data()?.followers || [];
      callback(followers);
  });

  return unsubscribe;
}

// Seguir a un usuario
export async function seguirUsuario(userId, usuarioASeguirId) {
  try {
      const userRef = doc(db, "users", userId);
      const usuarioASeguirRef = doc(db, "users", usuarioASeguirId);

      await updateDoc(userRef, {
          following: arrayUnion(usuarioASeguirId),
      });

      await updateDoc(usuarioASeguirRef, {
          followers: arrayUnion(userId),
      });

      console.log(
          "[red.js seguirUsuario] Usuario seguido con éxito:",
          usuarioASeguirId
      );

      return await getUserById(usuarioASeguirId);
  } catch (error) {
      console.error("[red.js seguirUsuario] Error al seguir usuario:", error);
  }
}

// Dejar de seguir a un usuario
export async function dejarDeSeguirUsuario(userId, usuarioADejarDeSeguirId) {
  try {
      const userRef = doc(db, "users", userId);
      const usuarioADejarDeSeguirRef = doc(
          db,
          "users",
          usuarioADejarDeSeguirId
      );

      await updateDoc(userRef, {
          following: arrayRemove(usuarioADejarDeSeguirId),
      });

      await updateDoc(usuarioADejarDeSeguirRef, {
          followers: arrayRemove(userId),
      });

      console.log(
          "[red.js dejarDeSeguirUsuario] Usuario dejado de seguir con éxito:",
          usuarioADejarDeSeguirId
      );

      return await getUserById(usuarioADejarDeSeguirId);
  } catch (error) {
      console.error(
          "[red.js dejarDeSeguirUsuario] Error al dejar de seguir usuario:",
          error
      );
  }
}