<script setup>
    import Image from "../components/Image.vue";
    import { useAuth } from "../composition/useAuth.js";
    import { useUser } from "../composition/useUser.js";
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { publishPost, getPosts, startRealtimePostListener } from "../services/feed.js";
    import { dateToString } from "../helpers/date.js";

    const { user } = useAuth();

    const newPostContent = ref("");

    const loading = ref(false);

    const posts = ref([]);

    const handleSubmit = async () => {
        //console.log("Datos del usuario:", user);
        //console.log("ID del usuario:", user.value.id);

        loading.value = true;

        try {
            if (newPostContent.value.trim() !== "" && user.value.id) {
                await publishPost(
                    {
                    content: newPostContent.value,
                    userId: user.value.id,
                    userDisplayName: user.value.displayName,
                    // Otros campos que desees agregar
                    }
                );

                newPostContent.value = "";
            } else {
                console.error("El ID del usuario no está definido o es inválido.");
            }
        } catch (error) {
            console.error('Error al publicar la publicación:', error);
        }

        loading.value = false;
    };

    const handleNewPosts = (newPosts) => {
        console.log('Nuevos posts:', newPosts);
        posts.value = newPosts;
    };

    const unsubscribe = startRealtimePostListener(handleNewPosts); // Inicia la escucha en tiempo real

    onBeforeUnmount(() => {
        // Detén la escucha al salir del componente para evitar fugas de memoria
        unsubscribe();
    });

    onMounted(async () => {
        try {
            // Recupera las publicaciones desde el servicio al cargar el componente
            const postSnapshot = await getPosts();
            posts.value = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        }
    });
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
                        v-model="newPostContent"
                    >
                    </textarea>
                    <button type="submit" class="icono-publicar">
                        <img src="../assets/img/publicar.png" alt="Icono Publicar" class="publicar" />
                    </button>
                </form>
            </div>
        </div>
    </section>
    <hr>
    <section class="p-3">
        <div v-for="post in posts" :key="post.id">
            <p>
                {{ post.content }} 
                <br>
                <strong>{{ post.userDisplayName }}</strong> - {{ dateToString(post.created_at) }}
            </p>
        </div>
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

    .icono-publicar {
        border: none; /* Elimina el borde del botón */
        background: none; /* Elimina el fondo del botón */
        padding: 0; /* Elimina el espacio interno del botón */
        cursor: pointer; /* Cambia el cursor a una mano al pasar el mouse sobre la imagen */
    }

    .publicar {
        width: 25px;
        height: 25px;
    }
</style>