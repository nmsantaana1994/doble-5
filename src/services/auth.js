import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  valoraciones: null,
  comentario: null,
  barrio: null,
  telefono: null,
  terminos: false,
  followers: [],
  following: [],
};

let observers = [];

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
      valoraciones: newUser.valoraciones,
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
        valoraciones: userData.valoraciones,
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
    console.log(user);
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
  valoraciones,
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
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      nacimiento: nacimiento,
      genero: genero,
      valoraciones: valoraciones,
      barrio: barrio,
      telefono: telefono,
      terminos: terminos,
    });

    return {
      id: user.uid,
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      nacimiento: nacimiento,
      genero: genero,
      valoraciones: valoraciones,
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
    valoraciones,
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
      valoraciones,
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
      valoraciones,
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
      valoraciones,
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
    valoraciones: null,
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
  // console.log("[auth.js notifyAll] Notificando a los observers: ", observers);
  observers.forEach((callback) => notify(callback));
}

function notify(callback) {
  callback({ ...user });
}

export async function sendResetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo de restablecimiento enviado");
  } catch (error) {
    console.error("Error enviando el correo:", error.message);
    return { success: false, error: error.message };
  }
}
