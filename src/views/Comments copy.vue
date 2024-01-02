<script setup>
    import Image from "../components/Image.vue";
    import { ref, onMounted } from "vue";
    import { getPostById, toggleLike, addComment } from "../services/feed.js";
    import { useRoute } from "vue-router";
    import { dateToString } from "../helpers/date.js";
    import { useAuth } from "../composition/useAuth.js";

    const route = useRoute();
    const { user } = useAuth();
    const postId = ref(route.params.postId);
    const post = ref(null);
    const newComment = ref("");

    onMounted(async () => {
        try {
            const fetchedPost = await getPostById(postId.value);

            if (fetchedPost) {
                post.value = fetchedPost;

                console.log("Post onMounted:", post);

                // Verifica si el usuario actual ya dio like a esta publicación
                if (user.value.id) {
                    post.value.liked = post.value.likes.includes(user.value.id);
                    console.log("Liked status:", post.value.liked);
                }
            } else {
                console.error("La publicación no se ha encontrado o ha sido eliminada.");
            }
        } catch (error) {
            console.error("Error al recuperar la publicación:", error);
        }
    });

    const addCommentView = async () => {
        if (!post || !post.value || !post.value.comments || !newComment || newComment.value.trim() === "") {
            console.error("No se puede agregar el comentario. Datos insuficientes.");
            return;
        }

        try {
            post.value = await addComment(post.value.id, user.value, newComment.value);

            // Limpia el campo del comentario
            newComment.value = "";
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
        }
    };

    const toggleLikeView = async () => {
        try {
            const updatedPost = await toggleLike(post.value.id, user.value.id);
            post.value = updatedPost;
        } catch (error) {
            console.error("Error al manejar el 'Me gusta':", error);
        }
    };
</script>

<template>
    <section class="p-3 m-0">
        <div class="row">
            <div class="col-3 d-flex justify-content-center">
                <router-link :to="`/feed`">
                    <img src="../assets/img/flecha-izquierda.png" style="width: 80%;" />
                    <i class="fi fi-sr-angle-left"></i>
                </router-link>
            </div>
            <div class="col-9 d-flex align-items-center">
                <h1 class="text-center m-0 ps-4">Publicación</h1>
            </div>
        </div>
    </section>
    <section class="p-3">
        <div v-if="post">
            <div class="row mb-3">
                <!-- Renderizar los detalles de la publicación -->
                <div class="col-2">
                    <Image :src="post.photoURL" class="rounded-circle foto-perfil" />
                </div>
                <div class="col-10">
                    <p class="m-0"><strong>{{ post.userDisplayName }}</strong></p>
                    <p class="font-date">{{ dateToString(post.created_at) }}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                    <p>{{ post.content }}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                    <div class="row">
                        <div class="col-6">
                            <button @click="toggleLikeView(post)" class="icono-publicar">
                                <div class="d-flex align-items-center">
                                    <img :src="post.liked ? '../src/assets/img/like-filled.png' : '../src/assets/img/like.png'" alt="Icono Me Gusta" class="publicar" />
                                    <p class="m-0 ps-2 fw-bold">{{ post.likes ? post.likes.length : 0 }} Me gusta</p>
                                </div>
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="icono-publicar">
                                <div class="d-flex align-items-center">
                                    <img src="../assets/img/comment.png" alt="Icono Comentarios" class="publicar" />
                                    <p class="m-0 ps-2 fw-bold" v-if="post.comments">{{ post.comments.length }} Comentarios</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Sección para agregar comentarios -->
            <div class="row mb-3">
                <div class="col-2">
                    <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
                </div>
                <div class="col-10">
                    <form 
                        action=""
                        method="post"
                        @submit.prevent="addCommentView"
                    >
                        <div class="row">
                            <div class="col-10">
                                <textarea
                                    name="post"
                                    id="post"
                                    cols="41"
                                    rows="1"
                                    placeholder="Deja un comentario"
                                    v-model="newComment"
                                >
                                </textarea>
                            </div>
                            <div class="col-2">
                                <button type="submit" class="icono-publicar">
                                    <img src="../assets/img/publicar.png" alt="Icono Publicar" class="publicar" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Sección para mostrar comentarios -->
            <div class="row">
                <div class="col-12">
                    <div class="row mt-3" v-if="post.comments && post.comments.length > 0">
                        <div v-for="comment in post.comments" :key="comment.created_at" class="col-12">
                            <p>
                                <strong>{{ comment.userDisplayName }}</strong>: {{ comment.content }}
                            </p>
                            <p class="font-date">{{ dateToString(comment.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        <!-- Otros detalles de la publicación, si es necesario -->
        </div>
        <div v-else>
            <p>La publicación no se ha encontrado o ha sido eliminada.</p>
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