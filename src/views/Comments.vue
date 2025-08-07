<script setup>
import Image from "../components/Image.vue";
import { ref, onMounted } from "vue";
import { getPostById, toggleLike, addComment } from "../services/feed.js";
import { useRoute } from "vue-router";
import { dateToString } from "../helpers/date.js";
import { useAuth } from "../composition/useAuth.js";
import Loader from "../components/Loader.vue";
import HeaderPage from "../components/HeaderPage.vue";
import Section from "../components/Section.vue";
import likeIcon from 'assets/img/like.png'
import likeFilledIcon from 'assets/img/like-filled.png'

const { post, user, newComment, loading, addCommentView, toggleLikeView } =
  useComments();

function useComments() {
  const route = useRoute();
  const { user } = useAuth();
  const postId = ref(route.params.postId);
  const post = ref(null);
  const newComment = ref("");
  const loading = ref(false);

  onMounted(async () => {
    try {
      loading.value = true;
      const fetchedPost = await getPostById(postId.value);

      if (fetchedPost) {
        post.value = fetchedPost;

        console.log("Post onMounted:", post);

        // Verifica si el usuario actual ya dio like a esta publicación
        if (user.value.id) {
          post.value.liked = post.value.likes.includes(user.value.id);
          console.log("Liked status:", post.value.liked);
        }

        loading.value = false;
      } else {
        console.error(
          "La publicación no se ha encontrado o ha sido eliminada."
        );
      }
    } catch (error) {
      console.error("Error al recuperar la publicación:", error);
    }
  });

  const addCommentView = async () => {
    if (
      !post ||
      !post.value ||
      !post.value.comments ||
      !newComment ||
      newComment.value.trim() === ""
    ) {
      console.error("No se puede agregar el comentario. Datos insuficientes.");
      return;
    }

    try {
      post.value = await addComment(
        post.value.id,
        user.value,
        newComment.value
      );

      // Limpia el campo del comentario
      newComment.value = "";
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  const toggleLikeView = async () => {
    try {
      const updatedPost = await toggleLike(post.value.id, user.value);
      post.value = updatedPost;
    } catch (error) {
      console.error("Error al manejar el 'Me gusta':", error);
    }
  };

  return {
    post,
    user,
    newComment,
    loading,
    addCommentView,
    toggleLikeView,
  };
}
</script>

<template>
  <HeaderPage route="/feed" title="Publicación" :hasBackground="false" />
  <Loader v-if="loading" />
  <Section v-else class="p-0">
    <!-- Si no hay post -->
    <div v-if="!post" class="not-found text-center py-4">
      <p>La publicación no se ha encontrado o ha sido eliminada.</p>
    </div>

    <!-- Si el post existe -->
    <div v-else>
      <!-- Card de la publicación -->
      <div class="post-card mb-4 p-3">
        <router-link
          :to="`/usuario/${post?.userId}`"
          class="col-12 mb-3 text-decoration-none text-dark"
        >
          <div class="row mb-2 align-items-center">
            <div class="col-2">
              <Image :src="post.photoURL" />
            </div>
            <div class="col-10">
              <p class="m-0">
                <strong>{{ post.userDisplayName }}</strong>
              </p>
              <p class="font-date">{{ dateToString(post.created_at) }}</p>
            </div>
          </div>
        </router-link>
        <div class="row">
          <div class="col-12">
            <p class="post-content">{{ post.content }}</p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-6 d-flex align-items-center">
            <button @click="toggleLikeView" class="action-btn">
              <img
                :src="post.liked ? likeFilledIcon : likeIcon"
                alt="Me gusta"
              />
              <span class="ms-2">{{ post.likes.length }} Me gusta</span>
            </button>
          </div>
          <div class="col-6 d-flex align-items-center justify-content-end">
            <button class="action-btn">
              <img src="../assets/img/comment.png" alt="Comentarios" />
              <span class="ms-2">{{ post.comments.length }} Comentarios</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Barra para dejar un comentario -->
      <div class="create-comment-bar mb-3 px-1 pt-2">
        <div class="d-flex align-items-center justify-content-center">
          <form @submit.prevent="addCommentView" class="row w-100">
            <div class="col-2 d-flex align-items-center">
              <Image :src="user.photoURL" class="comment-avatar me-3" />
            </div>
            <div class="col-8 d-flex align-items-center">
              <textarea
                v-model="newComment"
                placeholder="Dejá un comentario"
                rows="1"
                class="form-control flex-grow-1"
              ></textarea>
            </div>
            <div class="col-2 d-flex align-items-center justify-content-end">
              <button type="submit" class="btn-publish ms-2">
                <img src="../assets/img/publicar.png" alt="Enviar" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Título de sección -->
      <div class="px-3">
        <h2 class="comments-title">Comentarios</h2>
      </div>

      <!-- Lista de comentarios -->
      <div class="px-3 pb-4">
        <div v-if="post.comments && post.comments.length" class="comments-list">
          <div
            v-for="(comment, idx) in post.comments"
            :key="idx"
            class="comment-card mb-3 p-3"
          >
            <router-link
              :to="`/usuario/${comment?.userId}`"
              class="col-12 mb-3 text-decoration-none text-dark"
            >
              <div class="row">
                <div class="col-2 pt-2">
                  <Image
                    :src="comment.photoURL || comment.userPhoto"
                    class="comment-avatar"
                  />
                </div>
                <div class="col-10">
                  <p class="m-0">
                    <strong>{{ comment.userDisplayName }}</strong>
                  </p>
                  <p class="font-date">
                    {{ dateToString(comment.created_at) }}
                  </p>
                  <p class="comment-content mt-1">{{ comment.content }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-else class="text-center text-muted">
          <p>No hay comentarios aún</p>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
/* ————————————————————————
  Mensaje “no encontrado”
———————————————————————— */
.not-found p {
  color: #888;
  font-size: 0.9rem;
}

/* ————————————————————————
  Card de Publicación
———————————————————————— */
.post-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.post-card .font-date {
  color: #aaa;
  font-size: 0.75rem;
  margin-top: 0.2rem;
}
.post-content {
  color: #444;
  line-height: 1.5;
}

/* Botones de Like / Comentarios */
.action-btn {
  background-color: transparent;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
}
.action-btn img {
  width: 1.2rem;
  height: 1.2rem;
}
.action-btn span {
  font-size: 0.9rem;
  color: #555;
}

/* ————————————————————————
  Barra de Nuevo Comentario
———————————————————————— */
.create-comment-bar {
  background-color: #f2f2f2;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
/* 1) Fijo la caja del avatar y recorto overflow */
.comment-avatar {
  /* width: 2.5rem;
  height: 2.5rem; */
  border-radius: 50%;
  overflow: hidden; /* recorta cualquier parte que sobresalga */
  flex: 0 0 auto; /* no permita que crezca o encoja */
}

/* 2) Aseguro que la imagen llene la caja correctamente */
.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* centra y recorta la imagen para llenar la caja */
}
/* 3) Ajusto la altura de la barra de comentario para que sea consistente */
.create-comment-bar {
  align-items: center; /* centra verticalmente */
  min-height: 3.5rem; /* altura mínima que dé espacio al textarea y al avatar */
  overflow: hidden; /* evita que algo “asome” hacia afuera */
}
.create-comment-bar textarea {
  background: transparent;
  border: none;
  resize: none;
  padding: 0.5rem;
  font-size: 0.9rem;
}
.create-comment-bar textarea::placeholder {
  color: #bbb;
}
.btn-publish {
  /* background-color: #5d880d; */
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-publish img {
  width: 1.8rem;
  height: 1.8rem;
}

/* ————————————————————————
  Título y Lista de Comentarios
———————————————————————— */
.comments-title {
  font-size: 1rem;
  font-weight: 700;
  color: #555;
}
.comment-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.comment-content {
  color: #444;
  line-height: 1.4;
  margin-top: 0.25rem;
}
.font-date {
  font-size: 0.75rem;
  color: #aaa;
}
</style>
