/*
 Servicio para manejar todas las funcionalidades relativas al chat.
 Entre sus obligaciones, esta la de ser una capa de abstracción con respecto a Firebase.
*/

import {db} from "../../services/firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { getUserById } from "../../services/users";
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

export async function getMessagesByChat(chatId) {
    const messagesRef = collection(db, "private-chats", chatId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);
    const messages = [];
    messagesSnapshot.forEach(doc => {
        messages.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return messages;
  }
  
  // Función para obtener chats de un usuario con mensajes incluidos
  export async function getChatsByUser(userId) {
    const q = query(
        collection(db, "private-chats"),
        where(`users.${userId}`, "==", true)
    );
    const snapshot = await getDocs(q);
    const chats = [];
  
    for (const doc of snapshot.docs) {
        const chatData = doc.data();
        const usersInfo = {};
  
        // Obtener información completa de cada usuario en el chat
        await Promise.all(
            Object.keys(chatData.users).map(async (uid) => {
                const userData = await getUserById(uid);
                usersInfo[uid] = userData;
            })
        );
  
        // Obtener mensajes del chat
        const messages = await getMessagesByChat(doc.id);
  
        chats.push({
            id: doc.id,
            users: usersInfo,
            messages: messages
        });
    }
  
    return chats;
  }