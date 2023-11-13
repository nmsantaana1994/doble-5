<script setup>
    import Image from "../components/Image.vue";
    import { ref, onMounted } from "vue";
    import { getPostById, addLike, removeLike, updatePostComments } from "../services/feed.js";
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

    const addComment = async () => {
        if (!post || !post.value || !post.value.comments || !newComment || newComment.value.trim() === "") {
            console.error("No se puede agregar el comentario. Datos insuficientes.");
            return;
        }

        try {
            // Copia reactiva de los comentarios
            const commentsCopy = [...post.value.comments];

            // Agregar el nuevo comentario a la copia
            commentsCopy.push({
                userId: user.value.id,
                userDisplayName: user.value.displayName,
                content: newComment.value,
                created_at: serverTimestamp(),
            });

            // Actualizar la propiedad 'comments' de 'post.value' con la copia modificada
            post.value.comments = commentsCopy;

            // Actualizar la publicación en la base de datos
            await updatePostComments(post.value.id, post.value.comments);

            // Limpia el campo del comentario
            newComment.value = "";
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
        }
    };

    const toggleLike = async (post) => {
        if (!user.value.id) {
            console.error("El ID del usuario no está definido o es inválido.");
            return;
        }

        // Verifica si post está definido antes de acceder a sus propiedades
        if (post) {
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
    }
</script>

<template>
    <section class="row py-3 m-0">
        <div class="col-3 d-flex justify-content-center">
            <router-link :to="`/feed`">
                <img src="../assets/img/flecha-izquierda.png" style="width: 80%;" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
        </div>
        <div class="col-9 d-flex align-items-center">
            <h1 class="text-center m-0 ps-4">Publicación</h1>
        </div>
    </section>
    <section class="p-3">
        <div v-if="post">
            <div class="row">
                <!-- Renderizar los detalles de la publicación -->
                <div class="col-2">
                    <Image :src="post.photoURL" class="rounded-circle foto-perfil" />
                </div>
                <div class="col-10">
                    <p class="m-0"><strong>{{ post.userDisplayName }}</strong></p>
                    <p class="font-date">{{ dateToString(post.created_at) }}</p>
                </div>
            </div>
            <p>{{ post.content }}</p>
            <div class="row mt-3">
                <div class="col-6">
                    <button @click="toggleLike(post)" class="icono-publicar">
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
                <!-- Sección para agregar comentarios -->
                <div class="mt-3">
                    <textarea v-model="newComment" placeholder="Deja un comentario"></textarea>
                    <button @click="addComment" class="btn btn-primary mt-2">Comentar</button>
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