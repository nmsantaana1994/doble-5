<script setup>
    import {useAuth} from "../../composition/useAuth.js";
    import UserProfileForm from "../components/UserProfileForm.vue";
    import {ref, onMounted} from "vue";
    import Button from "../../components/Button.vue";
    import UserProfileData from "../components/UserProfileData.vue";
    import { obtenerSeguidores, obtenerSiguiendo } from '../../services/red.js';
    import Loading from "../../components/Loading.vue";
    const {user} = useAuth();
    const editing = ref(false);
    const toggleEditing = () => editing.value = !editing.value;
    const totalSeguidores = ref(0);
    const totalSiguiendo = ref(0);
    const loading = ref(false);

    onMounted(async () => {
        loading.value = true;

        if (user.value) {
            try {
                const seguidores = await obtenerSeguidores(user.value.id);
                const siguiendo = await obtenerSiguiendo(user.value.id);

                totalSeguidores.value = seguidores.length;
                totalSiguiendo.value = siguiendo.length;
            } catch (error) {
                console.error("Error al obtener seguidores y siguiendo:", error);
            }
        }

        loading.value = false;
    });
</script>

<template>
    <Loading :loading="loading"/>
    <section class="p-3 m-0">
        <div class="row">
            <div class="col-3 d-flex justify-content-center">
                <router-link :to="`/home`">
                    <img src="../../assets/img/flecha-izquierda.png" style="width: 80%;" />
                    <i class="fi fi-sr-angle-left"></i>
                </router-link>
            </div>
            <div class="col-9 d-flex align-items-center">
                <h1 class="text-center m-0 ps-4">Mi Perfil</h1>
            </div>
        </div>
    </section>
    <section class="p-3 mb-5">
        <template v-if="editing">
            <UserProfileForm />
        </template>
        <template v-else>
            <UserProfileData :user="user" :totalSeguidores="totalSeguidores" :totalSiguiendo="totalSiguiendo" :mostrarBoton="false" :loading="loading"/>
        </template>

        <div class="my-3">
            <Button class="btn btn-primary w-100" @click="toggleEditing">{{ editing ? "Dejar de Editar" : "Editar mi Perfil" }}</Button>
        </div>
    </section>
</template>

