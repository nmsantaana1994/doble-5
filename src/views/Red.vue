<script setup>
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../composition/useAuth.js';
    import { useUser } from '../composition/useUser.js';
    import { followUser, unfollowUser, getFollowers, getFollowing, getAvailableUsers } from '../services/red.js';

    const { user } = useAuth();
    const { user: currentUser, loading } = useUser(user.value.id);

    const followers = ref([]);
    const following = ref([]);
    const availableUsers = ref([]);

    onMounted(async () => {
        // Obtener la lista de seguidores y seguidos del usuario actual
        followers.value = (await getFollowers(currentUser.id)) || [];
        following.value = (await getFollowing(currentUser.id)) || [];

        // Obtener la lista de usuarios disponibles para seguir
        availableUsers.value = (await getAvailableUsers(currentUser.id)) || [];
    });

    async function followUserView(userId) {
        await followUser(currentUser.id, userId);
        // Actualizar las listas después de seguir a un usuario
        followers.value = (await getFollowers(currentUser.id)) || [];
        following.value = (await getFollowing(currentUser.id)) || [];
        availableUsers.value = (await getAvailableUsers(currentUser.id)) || [];
    }

    async function unfollowUserView(userId) {
        await unfollowUser(currentUser.id, userId);
        // Actualizar las listas después de dejar de seguir a un usuario
        followers.value = (await getFollowers(currentUser.id)) || [];
        following.value = (await getFollowing(currentUser.id)) || [];
        availableUsers.value = (await getAvailableUsers(currentUser.id)) || [];
    }
</script>

<template>
    <div>
        <h1>Red de Usuarios</h1>
    
        <h2>Seguidores</h2>
        <ul>
            <li v-for="follower in followers" :key="follower.id">
            {{ follower.displayName }}
            <button @click="unfollowUserView(follower.id)">Dejar de seguir</button>
            </li>
        </ul>
    
        <h2>Siguiendo</h2>
        <ul>
            <li v-for="following in following" :key="following.id">
            {{ following.displayName }}
            <button @click="unfollowUserView(following.id)">Dejar de seguir</button>
            </li>
        </ul>
    
        <h2>Usuarios Disponibles</h2>
        <ul>
            <li v-for="user in availableUsers" :key="user.id">
            {{ user.displayName }}
            <button @click="followUser(user.id)">Seguir</button>
            </li>
        </ul>
    </div>
  </template>