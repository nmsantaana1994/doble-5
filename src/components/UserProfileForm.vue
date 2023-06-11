<script set up>
    import Label from "./Label.vue";
    import Button from "./Button.vue";
    import Input from "./Input.vue";
    import Image from "./Image.vue";
    import {useAuth} from "../composition/useAuth.js";
    import {ref, watch} from "vue";
    import LoadingContext from "./LoadingContext.vue";
    import {updateUserProfile} from "../services/auth.js";

    const {user} = useAuth();
    const {form, loading, handleSubmit, handleFile} = useEditProfile(user);

    function useEditProfile(user) {
        const form = ref({
            displayName: "",
            career: "",
            photoURL: null,
        });

        const loading = ref(false);
        
        watch(user, newUser => {
            form.value.displayName = newUser.displayName;
            if (form.value.career === "" || newUser.career !== "") {
                form.value.career = newUser.career;
            }
        });

        async function handleSubmit() {
            loading.value = true;

            try {
                await updateUserProfile(user.value.id, {
                    ...form.value
                });
                loading.value = false;

                form.value.photoURL = null;
            } catch (err) {
                console.error("[MyProfile handleSubmit]", err);
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
    <div class="flex gap-3">
        <div class="w-3/12">
            <Image :src="user.photoURL" />
        </div>
        <div class="w-9/12">
            <form
                action="#"
                method="POST"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-3">
                    <Label for="displayName">Nombre de Usuario</Label>
                    <Input 
                        id="displayName"
                        v-model="form.displayName"
                    />
                </div>
                <div class="mb-3">
                    <Label for="career">Carrera</Label>
                    <Input 
                        id="career"
                        v-model="form.career"
                    />
                </div>
                <div class="mb-3">
                    <Label for="photoURL">Foto de Perfil</Label>
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