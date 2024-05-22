/*
 Servicio para manejar todas las funcionalidades relativas al chat.
 Entre sus obligaciones, esta la de ser una capa de abstracción con respecto a Firebase.
*/

import {db} from "../../services/firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

/**
 * Guarda un mensaje de chat en la base de datos
 * 
 * @param {{userId: string, displayName: string, message: string}} data 
 * @returns {Promise <null>}
 */
export function sendMessage(data){
    const chatRef = collection(db, 'minichat');

    return addDoc(chatRef, {
        ...data,
        created_at: serverTimestamp(),
    })
        .then(() => null)
        .catch(err => {
            console.error("[chat.js sendMessage] Ocurrió un error al enviar el mensaje.", err);
            throw err;
        });
}

/**
 * Crea una suscripción para recibir los mensajes de chat.
 * Cada vez que haya un nuevo mensaje, se ejecuta la función callback, la que recibe los mensajes como
 * un array de objetos.
 * 
 * @param {(messages:[{userId: string, displayName: string, message: string, created_at: Date}]) => {}} callback 
 * @return Unsubscribe
 */
export function subscribeToChatMessages(callback){
    const chatRef = collection(db, 'minichat');
    const q = query(chatRef, orderBy('created_at'));

    return onSnapshot(q, snapshot => {
        const output = [];

        snapshot.forEach(doc => {
            output.push({
                userId: doc.data().userId,
                displayName: doc.data().displayName,
                message: doc.data().message,
                created_at: doc.data().created_at?.toDate(),
            });
        });

        callback(output);
    });
}