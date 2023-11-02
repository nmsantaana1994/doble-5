<script setup>
    import Image from "../components/Image.vue";
    import { useAuth } from "../composition/useAuth.js";
    //import { useUser } from "../composition/useUser.js";
    import { ref, onMounted, /*onBeforeUnmount*/ } from "vue";
    import { publishPost, getPosts, addLike, removeLike /*startRealtimePostListener*/ } from "../services/feed.js";
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
                        photoURL: user.value.photoURL,
                        likes: [],
                        comments: [],
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

    const toggleLike = async (post) => {
        if (!user.value.id) {
            console.error("El ID del usuario no está definido o es inválido.");
            return;
        }

        const postId = post.id;
        const userLiked = post.likes.includes(user.value.id);

        try {
            // Agregar o quitar el "Me gusta" según el estado actual
            if (userLiked) {
                // Quitar el "Me gusta"
                post.likes = post.likes.filter((userId) => userId !== user.value.id);
                // Llamar a la función para eliminar el "Me gusta" en tu servicio
                // Debes implementar esta función en feed.js
                await removeLike(postId, user.value.id);
            } else {
                // Agregar el "Me gusta"
                post.likes.push(user.value.id);
                // Llamar a la función para agregar el "Me gusta" en tu servicio
                // Debes implementar esta función en feed.js
                await addLike(postId, user.value.id);
            }
            // Actualizar el estado del "Me gusta" en la publicación
            post.liked = !userLiked;
        } catch (error) {
            console.error("Error al manejar el 'Me gusta':", error);
        }
    }

    onMounted(async () => {
        try {
            // Recupera las publicaciones desde el servicio al cargar el componente
            const postSnapshot = await getPosts();
            posts.value = postSnapshot.docs.map(doc => {
                const postData = doc.data();
                // Inicializa 'likes' como una matriz vacía si no está presente en la publicación
                postData.likes = postData.likes || [];
                return { id: doc.id, ...postData };
            });
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
        <div class="card p-3 mb-3" v-for="post in posts" :key="post.id">
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-2">
                        <Image :src="post.photoURL" class="rounded-circle foto-perfil" />
                    </div>
                    <div class="col-10">
                        <p class="m-0"><strong>{{ post.userDisplayName }}</strong></p>
                        <p class="font-date">{{ dateToString(post.created_at) }}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="font-content">{{ post.content }}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <button @click="toggleLike(post)" class="icono-publicar">
                            <div class="d-flex align-items-center">
                                <img :src="post.liked ? '../src/assets/img/like-filled.png' : '../src/assets/img/like.png'" alt="Icono Me Gusta" class="publicar" />
                                <p class="m-0 ps-2 fw-bold">{{ post.likes ? post.likes.length : 0 }}</p>
                            </div>
                        </button>
                    </div>
                    <div class="col-6">
                        <router-link :to="`/comments/${post.id}`">
                            <button @click="viewComments(post)" class="icono-publicar">
                                <div class="d-flex align-items-center">
                                    <img src="../assets/img/comment.png" alt="Icono Comentarios" class="publicar" />
                                    <p class="m-0 ps-2 fw-bold">{{ post.comments.length }} Comentarios</p>
                                </div>
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
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

    .font-date {
        font-size: 0.7rem;
    }

    .font-content {
        color: #828282;
        font-weight: 500;
    }
</style>