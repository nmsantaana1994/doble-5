import { db } from "./firebase.js";
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getFileURL } from "./storage.js";
import {
    getStorage,
    ref as storageRef,
    uploadString,
    getDownloadURL,
} from "firebase/storage";

/**
 *
 * @param {string} id
 * @param {string} email
 * @return Promise<void>
 */
export function createUser(
  id,
  { email, nombre, apellido, nacimiento, genero, barrio, telefono, terminos }
) {
  const userRef = doc(db, "users", id);

  return setDoc(userRef, {
    email,
    nombre,
    apellido,
    nacimiento,
    followers: [], // Agregamos el campo followers
    following: [], // Agregamos el campo following
    genero,
    valoraciones: [],
    barrio,
    telefono,
    terminos,
  });
}

/**
 *
 * @param {string} id
 * @param {string|null} displayName
 * //@param {string|null} career
 * @param {string|null} photoURL
 * @returns {Promise<void>}
 */
export async function updateUser(
  id,
  {
    displayName,
    nombre,
    apellido,
    email,
    nacimiento,
    followers,
    following,
    genero,
    barrio,
    telefono,
    photoURL,
  }
) {
  console.log("Valores recibidos en updateUser:", {
    displayName,
    nombre,
    apellido,
    email,
    nacimiento,
    followers,
    following,
    valoraciones,
    genero,
    barrio,
    telefono,
    photoURL,
  });
  return updateDoc(doc(db, "users", id), {
    displayName,
    nombre,
    apellido,
    email,
    nacimiento,
    followers,
    following,
    genero,
    barrio,
    telefono,
    photoURL,
  });
}

/**
 *
 * @param {string} id
 * @returns {Promise<{id: string, email: string, displayName: string|null, career: string|null, photoURL: string|null}>}
 */
export async function getUserById(id) {
  const userRef = doc(db, "users", id);
  const user = await getDoc(userRef);

  if (!user.exists()) {
    throw new Error(
      "[users.js getUserById] No existe el usuario con el id provisto"
    );
  }

  const userData = user.data();

  const photoURL = userData?.photoURL
    ? await getFileURL(userData?.photoURL)
    : null;

  return {
    id,
    email: userData.email,
    displayName: userData.displayName,
    photoURL,
    nombre: userData.nombre,
    apellido: userData.apellido,
    nacimiento: userData.nacimiento,
    genero: userData.genero,
    valoraciones: userData.valoraciones || [],
    barrio: userData.barrio,
    telefono: userData.telefono,
    followers: userData.followers || [],
    following: userData.following || [],
  };
}

export async function agregarValoracion(userId, valoraciones) {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      valoraciones: arrayUnion(valoraciones),
    });

    console.log("Valoración agregada con éxito");
  } catch (error) {
    console.error("Error al agregar la valoración:", error);
    throw error;
  }
}

/**
 * Sube el DataURL al Storage y actualiza solo el campo photoURL en Firestore.
 * @param {string} userId 
 * @param {string} dataUrl 
 * @returns {Promise<string>} La URL pública del avatar
 */
export async function updateUserPhoto(userId, dataUrl) {
  // 1) Sube la imagen a Firebase Storage
  const storage = getStorage();
  const imgRef = storageRef(storage, `avatars/${userId}.jpg`);
  await uploadString(imgRef, dataUrl, "data_url");
  const downloadURL = await getDownloadURL(imgRef);

  // 2) Guarda solo la URL en el documento de usuario
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, { photoURL: downloadURL });

  return downloadURL;
}
