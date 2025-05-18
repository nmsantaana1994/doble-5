import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createUser, getUserById, updateUser } from "./users.js";
import { getFileURL, uploadFileUsingString } from "./storage.js";

// Los datos del usuario autenticado.
let user = {
  id: null,
  email: null,
  displayName: null,
  // career: null,
  photoURL: null,
  nombre: null,
  apellido: null,
  nacimiento: null,
  genero: null,
  nivel: null,
  barrio: null,
  telefono: null,
  terminos: false,
  followers: [],
  following: [],
};

// if (localStorage.getItem("user")) {
//   user = JSON.parse(localStorage.getItem("user"));
// }

// onAuthStateChanged(auth, async (newUser) => {
//   if (newUser) {
//     setUser({
//       id: newUser.uid,
//       email: newUser.email,
//       displayName: newUser.displayName,
//       photoURL: newUser.photoURL,
//       nombre: newUser.nombre,
//       apellido: newUser.apellido,
//       nacimiento: newUser.nacimiento,
//       genero: newUser.genero,
//       nivel: newUser.nivel,
//       barrio: newUser.barrio,
//       telefono: newUser.telefono,
//       followers: newUser.followers,
//       following: newUser.following,
//     });

//     if (newUser.photoURL) {
//       getFileURL(newUser.photoURL).then((url) => {
//         setUser({ photoURL: url });
//       });
//     }

//     getUserById(newUser.uid).then((userData) => {
//       setUser({
//         // career: userData.career,
//         nombre: userData.nombre,
//         apellido: userData.apellido,
//         nacimiento: userData.nacimiento,
//         genero: userData.genero,
//         nivel: userData.nivel,
//         barrio: userData.barrio,
//         telefono: userData.telefono,
//         followers: userData.followers,
//         following: userData.following,
//       });
//     });
//   } else {
//     clearUser();
//   }
// });

// /**
//  * Inicia sesión.
//  *
//  * @param {string} email
//  * @param {string} password
//  * @return {Promise<{id: string, email: string}>}
//  */
// export async function login({ email, password }) {
//   try {
//     const credentials = await signInWithEmailAndPassword(auth, email, password);

//     const user = credentials.user;
//     return {
//       id: user.uid,
//       email: user.email,
//     };
//   } catch (err) {
//     console.log("[auth.js login()] Error al autenticar el usuario", err);
//     throw err;
//   }
// }

// /**
//  * Crea una nueva cuenta.
//  *
//  * @param {string} email
//  * @param {string} password
//  * @return {Promise<{id: string, email: string}>}
//  */
// export async function register({
//   email,
//   password,
//   nombre,
//   apellido,
//   nacimiento,
//   genero,
//   nivel,
//   barrio,
//   telefono,
//   terminos,
// }) {
//   try {
//     const credentials = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     const user = credentials.user;

//     await createUser(user.uid, {
//       email: user.email,
//       nombre: nombre,
//       apellido: apellido,
//       nacimiento: nacimiento,
//       genero: genero,
//       nivel: nivel,
//       barrio: barrio,
//       telefono: telefono,
//       terminos: terminos,
//     });

//     return {
//       id: user.uid,
//       email: user.email,
//       nombre: nombre,
//       apellido: apellido,
//       nacimiento: nacimiento,
//       genero: genero,
//       nivel: nivel,
//       barrio: barrio,
//       telefono: telefono,
//       terminos: terminos,
//     };
//   } catch (err) {
//     console.log("[auth.js register()] Error al registrar el usuario", err);
//     throw err;
//   }
// }

// /**
//  * Cierra sesión.
//  *
//  * @return {Promise<void>}
//  */
// export function logout() {
//   // TODO: Limpiar los datos del usuario.
//   return signOut(auth);
// }

// /**
//  *
//  * @param {string} id
//  * @param {string} displayName
//  * //@param {string} career
//  * @param {string|null} photoURL
//  * @returns {Promise<Awaited<unknown>[]>}
//  */
// export async function updateUserProfile(
//   id,
//   {
//     displayName,
//     nombre,
//     apellido,
//     email,
//     nacimiento,
//     nivel,
//     genero,
//     barrio,
//     telefono,
//     photoURL,
//   }
// ) {
//   const promises = [];

//   let photoPath = user.photoURL;

//   if (photoURL) {
//     photoPath = user.id + "/avatar.jpg"; // TODO: Manejar diferentes tipos de imagen.
//     promises.push(uploadFileUsingString(photoPath, photoURL));
//   }

//   promises.push(
//     updateProfile(auth.currentUser, {
//       displayName,
//       nombre,
//       apellido,
//       email,
//       nacimiento,
//       nivel,
//       genero,
//       barrio,
//       telefono,
//       photoURL: photoPath,
//     })
//   );
//   promises.push(
//     updateUser(id, {
//       displayName,
//       nombre,
//       apellido,
//       email,
//       nacimiento,
//       nivel,
//       genero,
//       barrio,
//       telefono,
//       photoURL: photoPath,
//     })
//   );

//   return Promise.all(promises).then(() => {
//     setUser({
//       displayName,
//       nombre,
//       apellido,
//       email,
//       nacimiento,
//       nivel,
//       genero,
//       barrio,
//       telefono,
//       photoURL: photoPath,
//     });

//     if (photoURL)
//       getFileURL(photoPath).then((url) => setUser({ photoURL: url }));
//   });
// }
// export async function updateImageProfile(id, { photoURL }) {
//   const promises = [];

//   let photoPath = user.photoURL;

//   if (photoURL) {
//     photoPath = user.id + "/avatar.jpg"; // TODO: Manejar diferentes tipos de imagen.
//     promises.push(uploadFileUsingString(photoPath, photoURL));
//   }

//   promises.push(updateProfile(auth.currentUser, { photoURL: photoPath }));
//   promises.push(updateUser(id, { photoURL: photoPath }));

//   return Promise.all(promises).then(() => {
//     setUser({
//       photoURL: photoPath,
//     });

//     if (photoURL)
//       getFileURL(photoPath).then((url) => setUser({ photoURL: url }));
//   });
// }

// /**
//  *
//  * @param {{id: string|null, email: string|null, displayName: string|null, career: string|null, photoURL: string|null}} newData
//  */
// function setUser(newData) {
//   user = {
//     ...user,
//     ...newData,
//   };
//   localStorage.setItem("user", JSON.stringify(user));
//   notifyAll();
// }

// function clearUser() {
//   user = {
//     id: null,
//     email: null,
//     displayName: null,
//     // career: null,
//     nombre: null,
//     apellido: null,
//     nacimiento: null,
//     genero: null,
//     nivel: null,
//     barrio: null,
//     telefono: null,
//     followers: [],
//     following: [],
//   };
//   localStorage.removeItem("user");
//   notifyAll();
// }

let observers = [];

// /**
//  * Agrega el callback al stack.
//  * Este callback va a recibir como argumento un objeto con los datos del usuario.
//  * Retorna una función para cancelar la subscripción
//  *
//  * @param {(user: {id: string|null, email: string|null}) => void} callback
//  * @return {()=>{}} Función para cancelar la suscripción
//  */
// export function subscribeToAuth(callback) {
//   observers.push(callback);

//   notify(callback);

//   return () => (observers = observers.filter((obs) => obs !== callback));
// }

// /**
//  * Notifica a todos los observers.
//  */
// export function notifyAll() {
//   console.log("[auth.js notifyAll] Notificando a los observers: ", observers);
//   observers.forEach((callback) => notify(callback));
// }

// /**
//  * Notifica al observer de los datos del usuario.
//  *
//  * @param {(user: {id: string|null, email: string|null}) => void} callback
//  */
// export function notify(callback) {
//   callback({ ...user });
// }

// TEXTO COMENTADO POR LAS DUDAS, SE HICIERON CAMBIOS , AL PARECER NO HAY FALLAS PERO POR SI LAS MOSCAS

if (localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user"));
}

onAuthStateChanged(auth, async (newUser) => {
  if (newUser) {
    setUser({
      id: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      nacimiento: newUser.nacimiento,
      genero: newUser.genero,
      nivel: newUser.nivel,
      barrio: newUser.barrio,
      telefono: newUser.telefono,
      followers: newUser.followers,
      following: newUser.following,
    });

    if (newUser.photoURL) {
      getFileURL(newUser.photoURL).then((url) => {
        setUser({ photoURL: url });
      });
    }

    getUserById(newUser.uid).then((userData) => {
      setUser({
        nombre: userData.nombre,
        apellido: userData.apellido,
        nacimiento: userData.nacimiento,
        genero: userData.genero,
        nivel: userData.nivel,
        barrio: userData.barrio,
        telefono: userData.telefono,
        followers: userData.followers,
        following: userData.following,
      });
    });
  } else {
    clearUser();
  }
});

export async function login({ email, password }) {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const user = credentials.user;
    return {
      id: user.uid,
      email: user.email,
    };
  } catch (err) {
    console.log("[auth.js login()] Error al autenticar el usuario", err);
    throw err;
  }
}

export async function register({
  email,
  password,
  nombre,
  apellido,
  nacimiento,
  genero,
  nivel,
  barrio,
  telefono,
  terminos,
}) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user;

    await createUser(user.uid, {
        email: user.email,
        nombre: nombre,
        apellido: apellido,
        nacimiento: nacimiento,
        genero: genero,
        nivel: nivel,
        barrio: barrio,
        telefono: telefono,
        terminos: terminos,
        settings: {
            notifications: {
                chat: true,
                comentario: true,
                like: true,
                seguir: true,
            },
        },
    });

    return {
      id: user.uid,
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      nacimiento: nacimiento,
      genero: genero,
      nivel: nivel,
      barrio: barrio,
      telefono: telefono,
      terminos: terminos,
    };
  } catch (err) {
    console.log("[auth.js register()] Error al registrar el usuario", err);
    throw err;
  }
}

export function logout() {
  return signOut(auth);
}

export async function updateUserProfile(
  id,
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
) {
  const promises = [];
  let photoPath = user.photoURL;

  if (photoURL) {
    photoPath = user.id + "/avatar.jpg";
    promises.push(uploadFileUsingString(photoPath, photoURL));
  }

  promises.push(
    updateProfile(auth.currentUser, {
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
      photoURL: photoPath,
    })
  );
  promises.push(
    updateUser(id, {
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
      photoURL: photoPath,
    })
  );

  return Promise.all(promises).then(() => {
    setUser({
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
      photoURL: photoPath,
    });

    if (photoURL)
      getFileURL(photoPath).then((url) => setUser({ photoURL: url }));
  });
}

function setUser(newData) {
  user = {
    ...user,
    ...newData,
  };
  localStorage.setItem("user", JSON.stringify(user));
  notifyAll();
}

function clearUser() {
  user = {
    id: null,
    email: null,
    displayName: null,
    nombre: null,
    apellido: null,
    nacimiento: null,
    genero: null,
    nivel: null,
    barrio: null,
    telefono: null,
    followers: [],
    following: [],
  };
  localStorage.removeItem("user");
  notifyAll();
}

export function subscribeToAuth(callback) {
  observers.push(callback);
  notify(callback);
  return () => (observers = observers.filter((obs) => obs !== callback));
}

function notifyAll() {
  console.log("[auth.js notifyAll] Notificando a los observers: ", observers);
  observers.forEach((callback) => notify(callback));
}

function notify(callback) {
  callback({ ...user });
}
