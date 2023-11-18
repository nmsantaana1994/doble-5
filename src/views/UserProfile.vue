<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useUser } from '../composition/useUser';
    import LoadingContext from '../components/LoadingContext.vue';
    import UserProfileData from '../components/UserProfileData.vue';
    import { followUser, unfollowUser, getFollowing } from '../services/red.js';
    import { useAuth } from '../composition/useAuth'; // Agrega la importación

    const route = useRoute();
    const { user, loading } = useUser(route.params.id);
    const { user: currentUser } = useAuth(); // Obten el usuario actual
    const isFollowing = ref(false);

    onMounted(async () => {
        // Verificar si el usuario actual sigue al usuario de la vista
        isFollowing.value = await checkIfFollowing(user.id);
    });

    const toggleFollowStatus = async () => {
        if (isFollowing.value) {
        // Dejar de seguir al usuario
        await unfollowUser(currentUser.id, user.id);
        } else {
        // Seguir al usuario
        await followUser(currentUser.id, user.id);
        }

        // Actualizar el estado después de seguir/dejar de seguir
        isFollowing.value = !isFollowing.value;
    };

    // Función para verificar si el usuario actual sigue al usuario de la vista
    const checkIfFollowing = async (userId) => {
        // Implementa la lógica para verificar si el usuario actual sigue a userId
        // Puedes usar la función getFollowing del servicio red.js para obtener los usuarios seguidos por el usuario actual
        // y luego verificar si userId está en esa lista.
        // Retorna true si el usuario actual sigue a userId, de lo contrario, retorna false.
        // Ejemplo:
        const followingUsers = await getFollowing(currentUser.id);
        return followingUsers.some((u) => u.id === userId);
    };
</script>

<template>
    <LoadingContext :loading="loading">
        <section class="row p-1 m-0">
            <div class="col-12">
                <h1 class="mb-3 fs-4 text-center">Perfil de {{ user.displayName ? user.displayName : user.nombre }}</h1>
                <!-- Botón de seguir/dejar de seguir -->
                <button @click="toggleFollowStatus">
                    {{ isFollowing ? 'Dejar de seguir' : 'Seguir' }}
                </button>
        
                <UserProfileData :user="user" />
            </div>
    
            <div class="col-12 m-bottom">
                <h2 class="mb-3 fs-4">Chat privado</h2>
        
                <router-link
                    :to="`/usuario/${user.id}/chat`"
                    class="text-blue-400 underline"
                >Iniciar chat privado con {{ user.displayName ? user.displayName : user.nombre }}</router-link>
            </div>
        </section>
    </LoadingContext>
</template>

<style scoped>
    .m-bottom {
        margin-bottom: 5em;
    }
</style>