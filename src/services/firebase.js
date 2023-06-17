import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyAl5gyZFJjjtUe8Bp-DMT3d94fEaOVVIVs",
//     authDomain: "doble-5-test.firebaseapp.com",
//     projectId: "doble-5-test",
//     storageBucket: "doble-5-test.appspot.com",
//     messagingSenderId: "581763837770",
//     appId: "1:581763837770:web:af5606b0c26f6a62681bb3"
//   };

const firebaseConfig = {
    apiKey: "AIzaSyAvD6DEBhAsCF44RImexoURrBB3jkk6eNA",
    authDomain: "clase1-cwm-santa-ana.firebaseapp.com",
    projectId: "clase1-cwm-santa-ana",
    storageBucket: "clase1-cwm-santa-ana.appspot.com",
    messagingSenderId: "133270482651",
    appId: "1:133270482651:web:30666859a3810fc1fb26fe"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export {app, db, auth, storage};