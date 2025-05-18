import { db } from "../../services/firebase.js";
import {
    addDoc,
    getDoc,
    collection,
    collectionGroup,
    serverTimestamp,
    query,
    where,
    limit,
    getDocs,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore";
import { createNotification } from "../../notifications/services/notifications.js";

const cache = {};

/**
 * Suscribirse a un chat privado y recibir mensajes en tiempo real
 */
export async function subscribeToPrivateChat(from, to, callback) {
    const docRef = await getPrivateChatRef(from, to);

    const messagesCollection = collection(
        db,
        "private-chats",
        docRef.id,
        "messages"
    );

    const q = query(messagesCollection, orderBy("created_at"));

    return onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
            userId: doc.data().userId,
            message: doc.data().message,
            created_at: doc.data().created_at?.toDate(),
        }));
        callback(docs);
    });
}

/**
 * Enviar un mensaje privado y generar notificación si el destinatario no está presente
 */
export async function sendPrivateMessage(from, to, message) {
    const docRef = await getPrivateChatRef(from, to);
    const messagesRef = collection(db, "private-chats", docRef.id, "messages");

    await addDoc(messagesRef, {
        userId: from,
        message,
        created_at: serverTimestamp(),
    });

    try {
        const chatSnap = await getDoc(docRef);
        const chatData = chatSnap.data();

        const recipientIsPresent = chatData?.presence?.[to];

        if (!recipientIsPresent) {
            const userDoc = await getDoc(doc(db, "users", from));
            const senderName = userDoc.data()?.displayName || "Alguien";
            await createNotification(
                to,
                `${senderName} te ha enviado un mensaje`,
                "chat",
                from,
                `usuario/${from}/chat`
                // {
                //     type: "chat",
                //     chatId: docRef.id,
                //     from,
                // }
            );
        }
    } catch (error) {
        console.error(
            "Error al verificar la presencia o crear la notificación:",
            error
        );
    }

    return true;
}

/**
 * Actualiza el estado de presencia del usuario en el chat
 */
export async function setUserPresence(chatId, userId, isPresent) {
    try {
        const chatRef = doc(db, "private-chats", chatId);
        await updateDoc(chatRef, {
            [`presence.${userId}`]: isPresent,
        });
    } catch (error) {
        console.error("Error al actualizar la presencia del usuario:", error);
    }
}

/**
 * Obtener o crear una referencia al documento del chat entre dos usuarios
 */
export async function getPrivateChatRef(user1, user2) {
    const cachedRef = getFromCache(user1, user2);
    if (cachedRef) return cachedRef;

    const chatRef =
        (await searchPrivateChat(user1, user2)) ||
        (await createPrivateChat(user1, user2));
    addToCache(user1, user2, chatRef);
    return chatRef;
}

export async function searchPrivateChat(user1, user2) {
    const users = {
        [user1]: true,
        [user2]: true,
    };

    const q = query(
        collection(db, "private-chats"),
        where("users", "==", users),
        limit(1)
    );

    const chatSnap = await getDocs(q);
    return !chatSnap.empty ? chatSnap.docs[0].ref : null;
}

async function createPrivateChat(user1, user2) {
    return await addDoc(collection(db, "private-chats"), {
        users: {
            [user1]: true,
            [user2]: true,
        },
        presence: {
            [user1]: false,
            [user2]: false,
        },
    });
}

// Cache helpers
function getCacheKey(from, to) {
    return from < to ? from + to : to + from;
}

function getFromCache(from, to) {
    return cache[getCacheKey(from, to)] || null;
}

function addToCache(from, to, ref) {
    cache[getCacheKey(from, to)] = ref;
}

// import {db} from "../../services/firebase.js";
// import {
//     addDoc,
//     getDoc,
//     collection,
//     collectionGroup,
//     serverTimestamp,
//     query,
//     where,
//     limit,
//     getDocs,
//     orderBy,
//     onSnapshot,
//     doc
// } from "firebase/firestore";
// import { createNotification } from "../../notifications/services/notifications.js";
// import { ref, get } from "firebase/database";

// const cache = {};

// /**
//  * @param {string} from
//  * @param {string} to
//  * @param {(data: {userId: string, message: string, created_at: Date|null}[]) => void} callback
//  * @return {Promise<Unsubscribe>}
//  */
// export async function subscribeToPrivateChat(from, to, callback) {
//     const docRef = await getPrivateChatRef(from, to);

//     const messagesCollection = collection(db, 'private-chats', docRef.id, 'messages');

//     const q = query(
//         messagesCollection,
//         orderBy('created_at')
//     );

//     return onSnapshot(q, snapshot => {
//         console.log("[private-chats.js subscribeToPrivateChat] Obteniendo los nuevos mensajes a través de la suscripción solicitada...");
//         const docs = snapshot.docs.map(doc => {
//             return {
//                 userId: doc.data().userId,
//                 message: doc.data().message,
//                 created_at: doc.data().created_at?.toDate(),
//             }
//         });

//         callback(docs);
//     });
// }

// /**
//  *
//  * @param {string} from
//  * @param {string} to
//  * @param {string} message
//  * @returns {Promise<{userId: string, message: string, created_at: {}}>}
//  */
// export async function sendPrivateMessage(from, to, message) {
//     const docRef = await getPrivateChatRef(from, to);

//     const messagesRef = collection(db, 'private-chats', docRef.id, 'messages');

//     const messageRef = await addDoc(messagesRef, {
//         userId: from,
//         message,
//         created_at: serverTimestamp(),
//     });

//     // Verificar si el destinatario está en el mismo chat
//     try {
//         const recipientPresenceRef = ref(db, `presence/${to}`);
//         const recipientPresence = (await get(recipientPresenceRef)).val();

//         if (!recipientPresence || recipientPresence.chatId !== docRef.id) {
//             const userDoc = await getDoc(doc(db, "users", from));
//             const senderName = userDoc.data()?.displayName || "Alguien";
//             await createNotification(to, `${senderName} te ha enviado un mensaje`);
//         }
//     } catch (error) {
//         console.error("Error al verificar la presencia o crear la notificación:", error);
//     }

//     return true;
// }

// /**
//  * @param {string} user1
//  * @param {string} user2
//  * @returns {Promise<QueryDocumentSnapshot<DocumentData>|DocumentReference<{users: {} | {}}>>}
//  */
// export async function getPrivateChatRef(user1, user2) {
//     const cachedRef = getFromCache(user1, user2);
//     if(cachedRef) return cachedRef;

//     const chatRef = await searchPrivateChat(user1, user2) || await createPrivateChat(user1, user2);

//     addToCache(user1, user2, chatRef);
//     return chatRef;
// }

// /**
//  *
//  * @param {string} user1
//  * @param {string} user2
//  * @returns {Promise<QueryDocumentSnapshot<DocumentData>|null>}
//  */
// export async function searchPrivateChat(user1, user2) {
//         const users = {
//             [user1]: true,
//             [user2]: true,
//         }

//         const q = query(
//             collection(db, "private-chats"),
//             where('users', '==', users),
//             limit(1),
//         );

//         const chatSnap = await getDocs(q);

//         return !chatSnap.empty ? chatSnap.docs[0] : null;
// }

// /**
//  *
//  * @param {string} user1
//  * @param {string} user2
//  * @returns {Promise<DocumentReference<{users: {} | {[p: number]: boolean}}>>}
//  */
// async function createPrivateChat(user1, user2) {
//     return await addDoc(collection(db, "private-chats"), {
//         users: {
//             [user1]: true,
//             [user2]: true,
//         }
//     });
// }

// /**
//  * @param {string} from
//  * @param {string} to
//  * @return {string}
//  */
// function getCacheKey(from, to) {
//     return from < to ?
//          from + to :
//          to + from
// }

// /**
//  * @param {string} from
//  * @param {string} to
//  * @return {*}
//  */
// function getFromCache(from, to) {
//     return cache[getCacheKey(from, to)] || null;
// }

// /**
//  * @param {string} from
//  * @param {string} to
//  * @param {{}} ref
//  */
// function addToCache(from, to, ref) {
//     cache[getCacheKey(from, to)] = ref;
// }
