<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useUser } from '../composition/useUser';
    import { useAuth } from '../composition/useAuth';
    import { seguirUsuario, dejarDeSeguirUsuario, obtenerSeguidores, obtenerSiguiendo } from '../services/red.js';
    import LoadingContext from '../components/LoadingContext.vue';
    import UserProfileData from '../components/UserProfileData.vue';

    const route = useRoute();
    const { user, loading } = useUser(route.params.id);
    const { user: userAuth } = useAuth();
    const totalSeguidores = ref(0);
    const totalSiguiendo = ref(0);
    const userFollowing = ref(false);

    onMounted(async () => {
      const fetchUserData = async () => {
        if (user.value && userAuth.value) {
          try {
            const seguidores = await obtenerSeguidores(user.value.id);
            const siguiendo = await obtenerSiguiendo(user.value.id);

            totalSeguidores.value = seguidores.length;
            totalSiguiendo.value = siguiendo.length;

            // Verificar si el usuario actual está siguiendo al usuario cuyo perfil se visualiza
            userFollowing.value = seguidores.includes(userAuth.value.id);
          } catch (error) {
            console.error("Error al obtener seguidores y siguiendo:", error);
          }
        }
      };

      // Llama a fetchUserData cuando el componente se monta y cuando hay cambios en user o userAuth
      watch([user, userAuth], fetchUserData);

      // También llama a fetchUserData cuando se sigue o deja de seguir a un usuario
      watch(userFollowing, fetchUserData);
    });

    const seguirDejarSeguir = async () => {
        try {
            if (userFollowing.value) {
                // Dejar de seguir
                await dejarDeSeguirUsuario(userAuth.value.id, user.value.id);
                userFollowing.value = false;
            } else {
                // Seguir
                await seguirUsuario(userAuth.value.id, user.value.id);
                userFollowing.value = true;
            }
        } catch (error) {
            console.error("Error al seguir/dejar de seguir usuario:", error);
        }
    };
</script>

<template>
    <LoadingContext :loading="loading">
        <section class="row p-1 m-0">
            <div class="col-12">
                <h1 class="mb-3 fs-4 text-center">Perfil de {{ user.displayName ? user.displayName : user.nombre }}</h1>

                <UserProfileData :user="user" :totalSeguidores="totalSeguidores" :totalSiguiendo="totalSiguiendo" :seguirDejarSeguir="seguirDejarSeguir" :userFollowing="userFollowing" />
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