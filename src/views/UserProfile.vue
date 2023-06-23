<script setup>
    import { useRoute } from "vue-router";
    import { useUser } from "../composition/useUser";
    import LoadingContext from "../components/LoadingContext.vue";
    import UserProfileData from "../components/UserProfileData.vue";

    const route = useRoute();
    const {user, loading} = useUser(route.params.id);
</script>

<template>
    <LoadingContext :loading="loading">
        <section class="row p-1 m-0">
            <div class="col-12">
                <h1 class="mb-3 fs-4 text-center">Perfil de {{ user.displayName ? user.displayName : user.nombre }}</h1>
        
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