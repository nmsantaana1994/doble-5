import { db } from "./firebase.js";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFileURL } from "./storage.js";

/**
 * 
 * @param {string} id 
 * @param {string} email 
 * @return Promise<void>
 */
export function createUser(id, {email, nombre, apellido, nacimiento, genero, nivel, barrio, telefono, terminos}) {
    const userRef = doc(db, "users", id);

    return setDoc(userRef, {
        email,
        nombre,
        apellido,
        nacimiento,
        followers: [], // Agregamos el campo followers
        following: [], // Agregamos el campo following
        genero,
        nivel,
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
export async function updateUser(id, {displayName, nombre, apellido, email, nacimiento, followers, following, nivel, genero, barrio, telefono, photoURL}) {
    console.log("Valores recibidos en updateUser:", { displayName, nombre, apellido, email, nacimiento, followers, following, nivel, genero, barrio, telefono, photoURL });
    return updateDoc(
        doc(db, "users", id),
        {
            displayName,
            nombre,
            apellido,
            email,
            nacimiento,
            followers,
            following,
            nivel,
            genero,
            barrio,
            telefono,
            photoURL,
        }
    )
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, career: string|null, photoURL: string|null}>}
 */
export async function getUserById(id) {
    const userRef = doc(db, "users", id);

    const user = await getDoc(userRef);

    if (!user.exists) {
        throw new Error ("[users.js getUserById] No existe el usuario con el id provisto");
    }

    const userData = user.data();

    // Transforma el identificador en URL completa utilizando getFileURL
    const photoURL = userData.photoURL ? await getFileURL(userData.photoURL) : null;
    //console.log("Usuario sin loadPhoto:", user.photoURL);
    
    // loadPhoto();
    
    // console.log("Usuario:", user);

    // async function loadPhoto() {
    //     user.photoURL = await getFileURL(user.data().photoURL);
    // }

    return {
        id,
        email: user.data().email,
        displayName: user.data().displayName,
        // career: user.data().career,
        photoURL,
        nombre: user.data().nombre,
        apellido: user.data().apellido,
        nacimiento: user.data().nacimiento,
        genero: user.data().genero,
        nivel: user.data().nivel,
        barrio: user.data().barrio,
        telefono: user.data().telefono,
        followers: user.data().followers || [], // Agregamos el campo followers
        following: user.data().following || [], // Agregamos el campo following
    }
}



