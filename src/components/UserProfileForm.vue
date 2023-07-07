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
            nombre: "",
            apellido:"",
            email: "",
            nacimiento: "",
            nivel: "",
            genero: "",
            barrio: "",
            telefono: "",
            // career: "",
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
            form.value.nombre = newUser.nombre;
            form.value.apellido = newUser.apellido;
            form.value.email = newUser.email;
            form.value.nacimiento = newUser.nacimiento;
            form.value.nivel = newUser.nivel;
            form.value.genero = newUser.genero;
            form.value.barrio = newUser.barrio;
            form.value.telefono = newUser.telefono;
            // if (form.value.career === "" || newUser.career !== "") {
            //     form.value.career = newUser.career;
            // }
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
    <section class="row d-flex">
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
                    <Label for="nombre" class="me-3 fw-bold">Nombre: </Label>
                    <Input 
                        id="nombre"
                        v-model="form.nombre"
                    />
                </div>
                <div class="mb-3">
                    <Label for="apellido" class="me-3 fw-bold">Apellido: </Label>
                    <Input 
                        id="apellido"
                        v-model="form.apellido"
                    />
                </div>
                <div class="mb-3">
                    <Label for="email" class="me-3 fw-bold">Email: </Label>
                    <Input 
                        id="Email"
                        v-model="form.email"
                    />
                </div>
                <div class="mb-3">
                    <Label for="nacimiento" class="me-3 fw-bold">Fecha de Nacimiento: </Label>
                    <Input
                        type="date" 
                        id="nacimiento"
                        v-model="form.nacimiento"
                    />
                </div>
                <div class="mb-3">
                    <Label for="nivel" class="me-3 fw-bold">Nivel de Juego: </Label>
                    <Input 
                        id="nivel"
                        v-model="form.nivel"
                    />
                </div>
                <div class="mb-3">
                    <Label for="genero" class="me-3 fw-bold">Genero: </Label>
                    <Input 
                        id="genero"
                        v-model="form.genero"
                    />
                </div>
                <div class="mb-3">
                    <Label for="barrio" class="me-3 fw-bold">Barrio: </Label>
                    <Input 
                        id="barrio"
                        v-model="form.barrio"
                    />
                </div>
                <div class="mb-3">
                    <Label for="telefono" class="me-3 fw-bold">Teléfono: </Label>
                    <Input 
                        id="telefono"
                        v-model="form.telefono"
                    />
                </div>
                <!-- <div class="mb-3">
                    <Label for="career" class="me-3 fw-bold">Carrera: </Label>
                    <Input 
                        id="career"
                        v-model="form.career"
                    />
                </div> -->
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
                    <p class="mb-3 fw-bold">Previsualización de la imagen:</p>
                    <img :src="form.photoURL" alt="Previsualización foto de perfil" class="w-100">
                    <!--<Button type="button" @click="() => form.photoURL = null">Limpiar la imagen</Button>-->
                </div>
                <Button class="btn btn-primary w-100">
                    <LoadingContext :loading="loading">
                        Actualizar mis datos
                    </LoadingContext>
                </Button>
            </form>
        </div>
    </section>
</template>

<style scoped>
    .foto-perfil {
        width: 80%;
    }
</style>