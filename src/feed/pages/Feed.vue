<script setup>
    import Image from "../../components/Image.vue";
    import { useAuth } from "../../composition/useAuth.js";
    import { ref, onMounted } from "vue";
    import { publishPost, getPosts, toggleLike } from "../../services/feed.js";
    import { dateToString } from "../../helpers/date.js";
    import Loader from "../../components/Loader.vue";
    import HeaderPage from "../../components/HeaderPage.vue";
    const {user, newPostContent, loading, posts, handleSubmit, toggleLikeView } = useFeed();

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

                posts.value = postSnapshot.docs.map(doc => {
                    const postData = doc.data();
                    postData.likes = postData.likes || [];
                    postData.liked = postData.likes.includes(user.value.id);
                    return { id: doc.id, ...postData };
                });
            console.log(posts.value)
            } catch (error) {
                console.error('Error al obtener las publicaciones:', error);
            }

            loading.value = false;
        });
    
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
    
        const toggleLikeView = async (post) => {
            try {
                // Llama a la función del servicio para manejar el "Me gusta"
                const updatedPost = await toggleLike(post.id, user.value);
    
                // Actualiza el post en la lista con los nuevos datos
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
            toggleLikeView
        }
    }

</script>

<template>
    <div class="feed-wrapper">
        <HeaderPage route="/home" title="Feed" />
        <!-- <hr> -->
        <section class="container-fluid p-3 mt-6">
            <div class="row mb-3">
                <div class="col-2">
                    <Image :src="user.photoURL"/>
                </div>
                <div class="col-10 d-flex align-items-center">
                    <form 
                        action=""
                        method="post"
                        @submit.prevent="handleSubmit"
                        class="w-100"
                    >
                        <textarea
                            name="post"
                            id="post"
                            rows="1"
                            placeholder="¿Qué estas pensado?"
                            v-model="newPostContent"
                            class="form-control"
                        >
                        </textarea>
                        <button type="submit" class="icono-publicar">
                            <img src="../../assets/img/publicar.png" alt="Icono Publicar" class="publicar" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
        <hr>
        <Loader v-if="loading" />
        <section v-else class="p-3">
            <div class="card p-3 mb-3" v-for="post in posts" :key="post.id">
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-2">
                            <Image :src="post.photoURL"/>
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
                            <button @click="toggleLikeView(post)" class="icono-publicar">
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
                                        <img src="../../assets/img/comment.png" alt="Icono Comentarios" class="publicar" />
                                        <p class="m-0 ps-2 fw-bold">{{ post.comments.length }} Comentarios</p>
                                    </div>
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
    .icono-h2 {
        width: 25px;
        height: 25px;
    }

    textarea {
        resize: none;
        border: none;
        outline: none;
    }

    /* Todas las imágenes dentro del feed no exceden el ancho de su columna */
    img, .publicar {
        max-width: 100%;
        height: auto;
    }

    .feed-wrapper {
        overflow-x: hidden;
        /* Opcional: para móviles un padding extra */
        /* padding-right: 0.5rem;
        padding-left: 0.5rem; */
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

    .mt-6 {
        margin-top: 6rem;
    }
</style>