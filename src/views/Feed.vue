<script setup>
    import Image from "../components/Image.vue";
    import { useAuth } from "../composition/useAuth.js";
    import { ref } from "vue";

    const { user, fields, loading, handleSubmit } = useFeed();

    function useFeed() {
        const { user } = useAuth();

        const fields = ref({
            post: "",
        });

        const loading = ref(false);

        async function handleSubmit() {
            loading.value = true;

            await publishPost({
                ...fields.value,
            })

            loading.value = false;
        }

        return {
            user,
            fields,
            loading,
            handleSubmit,
        }
    }
</script>

<template>
    <section class="p-3">
        <div class="row align-items-center my-3">
            <div class="col-8">
                <h1 class="text-start h3">Feed</h1>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <img src="../assets/img/arrows-right.png" alt="Icono flechas dobles" class="icono-h2" />
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-2">
                <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
            </div>
            <div class="col-10 d-flex align-items-center justify-content-center">
                <form 
                    action=""
                    method="post"
                    @submit.prevent="handleSubmit"
                >
                    <textarea
                        name="post"
                        id="post"
                        cols="40"
                        rows="1"
                        placeholder="¿Qué estas pensado?"
                        v-model="fields.post"
                    >
                    </textarea>
                </form>
            </div>
        </div>
    </section>
    <hr>
    <section class="p-3">
        <p>Aca irian los posts</p>
    </section>
</template>

<style scoped>
    .icono-h2 {
        width: 25px;
        height: 25px;
    }

    .foto-perfil {
        width: 100%;
    }

    textarea {
        resize: none;
        border: none;
        outline: none;
    }
</style>