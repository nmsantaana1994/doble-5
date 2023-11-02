<script setup>
    import { ref, onMounted } from "vue";
    import { getPostById } from "../services/feed.js";
    import { useRouter } from "vue-router";

    const route = useRouter();
    const postId = ref(route.params.postId);
    const post = ref(null);

    onMounted(async () => {
        try {
            post.value = await getPostById(postId.value);
        } catch (error) {
            console.error("Error al recuperar la publicación:", error);
        }
    });

    const newComment = ref("");

    const addComment = async () => {
        if (newComment.value.trim() === "") {
            return;
        }

        try {
            // Agregar el nuevo comentario a la publicación
            props.post.comments.push({
            userId: user.value.id,
            userDisplayName: user.value.displayName,
            content: newComment.value,
            created_at: new Date(),
            });

            // Actualizar la publicación en la base de datos
            await updatePostComments(props.post.id, props.post.comments);

            // Limpia el campo del comentario
            newComment.value = "";
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
        }
    };
</script>

<template>
    <div>
        <h1>Detalles de la Publicación</h1>
        <div v-if="post">
            <!-- Renderizar los detalles de la publicación -->
            <h2>{{ post.userDisplayName }}</h2>
            <p>{{ post.content }}</p>
            <!-- Verificar si la publicación tiene comentarios -->
            <div v-if="post.comments && post.comments.length > 0">
                <h3>Comentarios</h3>
                <ul>
                    <li v-for="comment in post.comments" :key="comment.id">{{ comment.text }}</li>
                </ul>
            </div>
            <div v-else>
                <p>Esta publicación no tiene comentarios aún.</p>
            </div>
        <!-- Otros detalles de la publicación, si es necesario -->
        </div>
        <div v-else>
            <p>La publicación no se ha encontrado o ha sido eliminada.</p>
        </div>
    </div>
</template>