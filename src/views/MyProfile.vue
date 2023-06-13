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
    <section class="p-3">
        <h1 class="mb-3">Mi Perfil</h1>
    
        <div class="mb-3">
            <Button @click="toggleEditing">{{ editing ? "Dejar de Editar" : "Editar mi Perfil" }}</Button>
        </div>
    
        <template v-if="editing">
            <UserProfileForm />
        </template>
        <template v-else>
            <UserProfileData :user="user" />
        </template>
    </section>
</template>