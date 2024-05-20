import {db} from "../../services/firebase.js";
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
    onSnapshot
} from "firebase/firestore";

const cache = {};

/**
 * @param {string} from
 * @param {string} to
 * @param {(data: {userId: string, message: string, created_at: Date|null}[]) => void} callback
 * @return {Promise<Unsubscribe>}
 */
export async function subscribeToPrivateChat(from, to, callback) {
    const docRef = await getPrivateChatRef(from, to);
    
    const messagesCollection = collection(db, 'private-chats', docRef.id, 'messages');

    const q = query(
        messagesCollection,
        orderBy('created_at')
    );

    return onSnapshot(q, snapshot => {
        console.log("[private-chats.js subscribeToPrivateChat] Obteniendo los nuevos mensajes a través de la suscripción solicitada...");
        const docs = snapshot.docs.map(doc => {
            return {
                userId: doc.data().userId,
                message: doc.data().message,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(docs);
    });
}

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @param {string} message 
 * @returns {Promise<{userId: string, message: string, created_at: {}}>}
 */
export async function sendPrivateMessage(from, to, message) {
    const docRef = await getPrivateChatRef(from, to);

    const messagesRef = collection(db, 'private-chats', docRef.id, 'messages');

    const messageRef = await addDoc(messagesRef, {
        userId: from,
        message,
        created_at: serverTimestamp(),
    });

    return true;
}

/**
 * @param {string} user1 
 * @param {string} user2 
 * @returns {Promise<QueryDocumentSnapshot<DocumentData>|DocumentReference<{users: {} | {}}>>}
 */
export async function getPrivateChatRef(user1, user2) {
    const cachedRef = getFromCache(user1, user2);
    if(cachedRef) return cachedRef;

    const chatRef = await searchPrivateChat(user1, user2) || await createPrivateChat(user1, user2);

    addToCache(user1, user2, chatRef);
    return chatRef;
}

/**
 * 
 * @param {string} user1 
 * @param {string} user2 
 * @returns {Promise<QueryDocumentSnapshot<DocumentData>|null>}
 */
export async function searchPrivateChat(user1, user2) {
        const users = {
            [user1]: true,
            [user2]: true,
        }

        const q = query(
            collection(db, "private-chats"),
            where('users', '==', users),
            limit(1),
        );

        const chatSnap = await getDocs(q);

        return !chatSnap.empty ? chatSnap.docs[0] : null;
}

/**
 * 
 * @param {string} user1 
 * @param {string} user2
 * @returns {Promise<DocumentReference<{users: {} | {[p: number]: boolean}}>>}
 */
async function createPrivateChat(user1, user2) {
    return await addDoc(collection(db, "private-chats"), {
        users: {
            [user1]: true,
            [user2]: true,
        }
    });
}

/**
 * @param {string} from
 * @param {string} to
 * @return {string}
 */
function getCacheKey(from, to) {
    return from < to ?
         from + to :
         to + from
}

/**
 * @param {string} from
 * @param {string} to
 * @return {*}
 */
function getFromCache(from, to) {
    return cache[getCacheKey(from, to)] || null;
}

/**
 * @param {string} from
 * @param {string} to
 * @param {{}} ref
 */
function addToCache(from, to, ref) {
    cache[getCacheKey(from, to)] = ref;
}
