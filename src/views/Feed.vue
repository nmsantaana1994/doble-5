<script setup>
    import Image from "../components/Image.vue";
    import { useAuth } from "../composition/useAuth.js";
    import { ref, onMounted } from "vue";
    import { publishPost, getPosts, addLike, removeLike } from "../services/feed.js";
    import { dateToString } from "../helpers/date.js";

    const { user } = useAuth();

    const newPostContent = ref("");

    const loading = ref(false);

    const posts = ref([]);

    const handleSubmit = async () => {

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

                // Después de publicar, actualiza la lista de posts
                const updatedPostSnapshot = await getPosts();
                posts.value = updatedPostSnapshot.docs.map(doc => {
                    const postData = doc.data();
                    postData.likes = postData.likes || [];
                    postData.liked = postData.likes.includes(user.value.id);
                    return { id: doc.id, ...postData };
                });
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
                await removeLike(postId, user.value.id);
            } else {
                // Agregar el "Me gusta"
                post.likes.push(user.value.id);
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
                postData.likes = postData.likes || [];
                postData.liked = postData.likes.includes(user.value.id);
                return { id: doc.id, ...postData };
            });
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        }
    });
</script>

<template>
    <section class="row py-3 m-0">
        <div class="col-3 d-flex justify-content-center">
            <router-link :to="`/home`">
                <img src="../assets/img/flecha-izquierda.png" style="width: 80%;" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
        </div>
        <div class="col-9 d-flex align-items-center">
            <h1 class="text-center m-0 ps-4">Feed</h1>
        </div>
    </section>
    <hr>
    <section class="p-3">
        <!-- <div class="row align-items-center my-3">
            <div class="col-8">
                <h1 class="text-start h3">Feed</h1>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <img src="../assets/img/arrows-right.png" alt="Icono flechas dobles" class="icono-h2" />
            </div>
        </div> -->
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
                            <button class="icono-publicar">
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
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
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