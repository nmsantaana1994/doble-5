import {
    collection,
    serverTimestamp,
    addDoc,
    query,
    getDocs,
    getDoc,
    where,
    doc,
    updateDoc,
    onSnapshot
  } from "@firebase/firestore";
  import { db } from "../../services/firebase";
  
  export async function getCanchas() {
    const q = collection(db, "canchas");
    const snapshot = await getDocs(q);
    const canchas = [];
    snapshot.forEach((doc) => {
      canchas.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return canchas;
  }