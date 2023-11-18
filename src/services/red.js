import { db } from "./firebase.js";
import { doc, arrayUnion, arrayRemove, updateDoc, getDocs, query, where } from "firebase/firestore";

// Función para seguir a un usuario
export async function followUser(userId, followUserId) {
    try {
        const userRef = doc(db, "users", userId);
        const followUserRef = doc(db, "users", followUserId);

        // Asegúrate de que las propiedades existan e inicialízalas como arrays si es necesario
        await updateDoc(userRef, { following: arrayUnion(followUserId), followers: [] });
        await updateDoc(followUserRef, { followers: arrayUnion(userId), following: [] });
    } catch (error) {
        console.error('Error al seguir al usuario:', error);
        throw error;
    }
}

// Función para dejar de seguir a un usuario
export async function unfollowUser(userId, unfollowUserId) {
    try {
        const userRef = doc(db, "users", userId);
        const unfollowUserRef = doc(db, "users", unfollowUserId);

        // Asegúrate de que las propiedades existan e inicialízalas como arrays si es necesario
        await updateDoc(userRef, { following: arrayRemove(unfollowUserId), followers: [] });
        await updateDoc(unfollowUserRef, { followers: arrayRemove(userId), following: [] });
    } catch (error) {
        console.error('Error al dejar de seguir al usuario:', error);
        throw error;
    }
}

// Obtener la lista de seguidores de un usuario
export async function getFollowers(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const followersQuery = query(
            db.collection('users'),
            where('following', 'array-contains', userRef)
        );

        const followersSnapshot = await getDocs(followersQuery);

        const followers = [];

        followersSnapshot.forEach((doc) => {
            const userData = doc.data();
            followers.push({
                id: doc.id,
                displayName: userData.displayName,
            });
        });

        return followers;
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        throw error;
    }
}

// Obtener la lista de usuarios a los que un usuario sigue
export async function getFollowing(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const followingQuery = query(
            db.collection('users'),
            where('followers', 'array-contains', userRef)
        );

        const followingSnapshot = await getDocs(followingQuery);

        const following = [];

        followingSnapshot.forEach((doc) => {
            const userData = doc.data();
            // Verificar si 'followers' es un array antes de usar 'indexOf'
            if (Array.isArray(userData.followers) && userData.followers.indexOf(userId) !== -1) {
                following.push({
                    id: doc.id,
                    displayName: userData.displayName,
                });
            }
        });

        return following;
    } catch (error) {
        console.error('Error al obtener usuarios seguidos:', error);
        throw error;
    }
}

// Obtener la lista de usuarios disponibles para seguir
export async function getAvailableUsers(currentUserId) {
    try {
        const usersRef = db.collection('users');
        const usersSnapshot = await getDocs(usersRef);
    
        const availableUsers = [];
    
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            // Verificar si el usuario actual ya sigue a este usuario
            if (doc.id !== currentUserId && !userData.followers?.includes(currentUserId)) {
            availableUsers.push({
                id: doc.id,
                displayName: userData.displayName,
            });
            }
        });
    
        return availableUsers;
    } catch (error) {
        console.error('Error al obtener usuarios disponibles:', error);
        throw error;
    }
}