<script setup>
    import {useAuth} from "../composition/useAuth.js";
    import UserProfileForm from "../components/UserProfileForm.vue";
    import {ref} from "vue";
    import Button from "../components/Button.vue";
    import UserProfileData from "../components/UserProfileData.vue";

    const {user} = useAuth();
    const editing = ref(false);
    const toggleEditing = () => editing.value = !editing.value;
</script>

<template>
    <section class="p-3 mb-5">
        <h1 class="mb-3 text-center">Mi Perfil</h1>
    
        <template v-if="editing">
            <UserProfileForm />
        </template>
        <template v-else>
            <UserProfileData :user="user" />
        </template>

        <div class="my-3">
            <Button class="btn btn-primary w-100" @click="toggleEditing">{{ editing ? "Dejar de Editar" : "Editar mi Perfil" }}</Button>
        </div>
    </section>
</template>

