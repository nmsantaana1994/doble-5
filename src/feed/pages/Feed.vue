<script setup>
import Image from "../../components/Image.vue";
import { useAuth } from "../../composition/useAuth.js";
import { ref, onMounted } from "vue";
import { publishPost, getPosts, toggleLike } from "../../services/feed.js";
import { dateToString } from "../../helpers/date.js";
import Loader from "../../components/Loader.vue";
import HeaderPage from "../../components/HeaderPage.vue";
const { user, newPostContent, loading, posts, handleSubmit, toggleLikeView } =
  useFeed();

function useFeed() {
  const { user } = useAuth();

  const newPostContent = ref("");

  const loading = ref(false);

  const posts = ref([]);

  onMounted(async () => {
    loading.value = true;

    try {
      // Recupera las publicaciones desde el servicio al cargar el componente
      const postSnapshot = await getPosts();

      posts.value = postSnapshot.docs.map((doc) => {
        console.log("doc", doc);

        const postData = doc.data();
        postData.likes = postData.likes || [];
        postData.liked = postData.likes.includes(user.value.id);
        return { id: doc.id, ...postData };
      });
      console.log("post value", posts.value);
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }

    loading.value = false;
  });

  const handleSubmit = async () => {
    loading.value = true;

    try {
      if (newPostContent.value.trim() !== "" && user.value.id) {
        await publishPost({
          content: newPostContent.value,
          userId: user.value.id,
          userDisplayName: user.value.displayName,
          photoURL: user.value.photoURL,
          likes: [],
          comments: [],
        });

        newPostContent.value = "";

        const updatedPostSnapshot = await getPosts();
        posts.value = updatedPostSnapshot.docs.map((doc) => {
          const postData = doc.data();
          console.log("postData", postData);
          postData.likes = postData.likes || [];
          postData.liked = postData.likes.includes(user.value.id);
          return { id: doc.id, ...postData };
        });
      } else {
        console.error("El ID del usuario no está definido o es inválido.");
      }
    } catch (error) {
      console.error("Error al publicar la publicación:", error);
    }

    loading.value = false;
  };

  const toggleLikeView = async (post) => {
    try {
      const updatedPost = await toggleLike(post.id, user.value);

      const postIndex = posts.value.findIndex((p) => p.id === updatedPost.id);
      if (postIndex !== -1) {
        posts.value[postIndex] = updatedPost;
      }
    } catch (error) {
      console.error("Error al manejar el 'Me gusta':", error);
    }
  };

  return {
    user,
    newPostContent,
    loading,
    posts,
    handleSubmit,
    toggleLikeView,
  };
}
</script>

<template>
  <div class="feed-wrapper">
    <HeaderPage route="/home" title="Feed" class="" />

    <!-- Barra de nuevo post -->
    <section class="container-fluid p-3 mt-6">
      <div class="row mb-3 px-2 align-items-center">
        <div class="col-2 p-0">
          <Image :src="user.photoURL" />
        </div>
        <div class="col-10">
          <form @submit.prevent="handleSubmit" class="create-post-bar">
            <div class="row">
              <div class="col-12">
                <textarea
                  v-model="newPostContent"
                  placeholder="¿Qué estás pensando?"
                  rows="1"
                  class="form-control flex-grow-1"
                ></textarea>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <button type="submit" class="btn-publish ms-2">
                  <img src="../../assets/img/publicar.png" alt="Enviar" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

    <hr />

    <!-- Loader mientras carga -->
    <Loader v-if="loading" />

    <!-- Listado de posts -->
    <section v-else class="p-3">
      <div class="card mb-3" v-for="post in posts" :key="post.id">
        <div class="card-body">
          <!-- Header de usuario + fecha -->
          <router-link
            :to="`/usuario/${post?.userId}`"
            class="col-12 mb-3 text-decoration-none text-dark"
          >
            <div class="row mb-3 align-items-center">
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

          <!-- Contenido -->
          <div class="row">
            <div class="col-12">
              <p class="font-content">{{ post.content }}</p>
            </div>
          </div>

          <!-- Footer de acciones -->
          <div class="row mt-3">
            <div class="col-6 d-flex align-items-center">
              <button @click="toggleLikeView(post)" class="action-btn">
                <img
                  :src="
                    post.liked
                      ? '../../assets/img/like-filled.png'
                      : '../../assets/img/like.png'
                  "
                  alt="Me gusta"
                />
                <span class="ms-2">{{ post.likes.length }}</span>
              </button>
            </div>
            <div class="col-6 d-flex align-items-center justify-content-end">
              <router-link
                :to="`/comments/${post.id}`"
                class="text-decoration-none"
              >
                <button class="action-btn">
                  <img src="../../assets/img/comment.png" alt="Comentarios" />
                  <span class="ms-2">{{ post.comments.length }}</span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feed-wrapper {
  background-color: #fafafa;
  padding-bottom: 4rem;
  overflow-x: hidden;
  padding-top: 120px;
}

/* ————————————————————————
   1) Barra de nuevo post
   ———————————————————————— */
.create-post-bar {
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.create-post-bar textarea {
  background: transparent;
  border: none;
  resize: none;
  padding: 0.75rem;
  font-size: 0.9rem;
}

.create-post-bar textarea::placeholder {
  color: #bbb;
}

.btn-publish {
  background-color: transparent;
  border: none;
  /* border-radius: 50%; */
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-publish img {
  width: 1.2rem;
  height: 1.2rem;
}

/* ————————————————————————
   2) Separador
   ———————————————————————— */
hr {
  border: none;
  height: 1px;
  background-color: #eee;
  margin: 0.5rem 0;
}

/* ————————————————————————
   3) Tarjeta de publicación
   ———————————————————————— */
.card {
  background-color: #fff !important;
  border: none !important;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-body {
  padding: 1rem;
}

/* Fecha y contenido */
.font-date {
  color: #aaa;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.font-content {
  color: #444;
  line-height: 1.5;
  margin-top: 0.5rem;
}

/* Botones de acciones */
.action-btn {
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
</style>
