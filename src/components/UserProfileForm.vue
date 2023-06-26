<script setup>
    import Label from "./Label.vue";
    import Button from "./Button.vue";
    import Input from "./Input.vue";
    import Image from "./Image.vue";
    import {useAuth} from "../composition/useAuth.js";
    import {inject, ref, watch} from "vue";
    import LoadingContext from "./LoadingContext.vue";
    import {updateUserProfile} from "../services/auth.js";
    import { notificationProvider } from "../symbols/symbols.js";

    const {user} = useAuth();
    const {form, loading, handleSubmit, handleFile} = useEditProfile(user);
    const {feedback, setFeedbackMessage, clearFeedbackMessage} = inject(notificationProvider);

    function useEditProfile(user) {
        const form = ref({
            displayName: "",
            career: "",
            photoURL: null,
        });

        const loading = ref(false);
        const feedback = ref({
            message: "",
            type: "succes",
            title: "",
        });
        
        watch(user, newUser => {
            form.value.displayName = newUser.displayName;
            if (form.value.career === "" || newUser.career !== "") {
                form.value.career = newUser.career;
            }
        });

        async function handleSubmit() {
            loading.value = true;

            try {
                clearFeedbackMessage();
                
                await updateUserProfile(user.value.id, {
                    ...form.value
                });
                loading.value = false;

                form.value.photoURL = null;

                setFeedbackMessage({
                    type: "succes",
                    message: "La información de tu perfil fue actualizada con éxito.",
                });
            } catch (err) {
                console.error("[MyProfile handleSubmit]", err);

                setFeedbackMessage({
                    type: "error",
                    message: "Ocurrió un error inesperado al tratar de actualizar la información de tu perfil.",
                });
            }
        }

        async function handleFile(ev) {
            const file = ev.target.files[0];

            const reader = new FileReader();

            reader.addEventListener("load", () => {
                form.value.photoURL = reader.result;
            });

            reader.readAsDataURL(file);
        }

        return {
            form,
            loading,
            handleSubmit,
            handleFile
        }
    }
</script>

<template>
    <div class="row d-flex">
        <div class="col-12 mb-3 d-flex justify-content-center">
            <Image :src="user.photoURL" class="rounded-circle foto-perfil"/>
        </div>
        <div class="col-12">
            <form
                action="#"
                method="POST"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-3">
                    <Label for="displayName" class="me-3 fw-bold">Nombre de Usuario: </Label>
                    <Input 
                        id="displayName"
                        v-model="form.displayName"
                    />
                </div>
                <div class="mb-3">
                    <Label for="career" class="me-3 fw-bold">Carrera: </Label>
                    <Input 
                        id="career"
                        v-model="form.career"
                    />
                </div>
                <div class="mb-3">
                    <Label for="photoURL" class="fw-bold">Foto de Perfil: </Label>
                    <Input 
                        type="file"
                        id="photoURL"
                        @change="handleFile"
                    />
                </div>
                <div
                    v-if="form.photoURL !== null"
                    class="mb-3"
                >
                    <p class="mb-3">Previsualización de la imagen</p>
                    <img :src="form.photoURL" alt="">
                    <!--<Button type="button" @click="() => form.photoURL = null">Limpiar la imagen</Button>-->
                </div>
                <Button full>
                    <LoadingContext :loading="loading">
                        Actualizar mis datos
                    </LoadingContext>
                </Button>
            </form>
        </div>
    </div>
</template>

<style scoped>
    .foto-perfil {
        width: 80%;
    }
</style>