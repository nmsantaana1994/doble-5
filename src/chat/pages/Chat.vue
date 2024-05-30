<!-- <script setup> 
    import { dateToString } from "../../helpers/date.js";
    import { subscribeToChatMessages, sendMessage } from "../services/chat.js";
    import Button from "../../components/Button.vue";
    import Label from "../../components/Label.vue";
    import Textarea from "../../components/Textarea.vue";
    import {ref, onMounted, onUnmounted} from "vue";
    import {useAuth} from "../../composition/useAuth.js";
    import Loader from "../../components/Loader.vue";
    import Image from "../../components/Image.vue";
    import { getFileURL } from "../../services/storage.js";

    const {messages, initialLoading} = useChat();
    const {handleSubmit, formLoading, form, user} = useChatForm();

    function useChat() {
        const initialLoading = ref(true);
        const messages = ref([]);
        let unsubscribe = () => {};

        onMounted(() => {
            unsubscribe = subscribeToChatMessages(newMessages => {
            initialLoading.value = false;
            messages.value = newMessages;
            });
        });

        onUnmounted(() => {
            unsubscribe();
        });

        return {
            initialLoading,
            messages
        }
    }

    function useChatForm() {
        const form = ref ({
            message: "",
        });
        const formLoading = ref(false);
        const {user} = useAuth();

        function handleSubmit() {
            formLoading.value = true;
            sendMessage ({
                userId: user.value.id,
                email: user.value.email,
                displayName: user.value.displayName || user.value.email,
                message: form.value.message,
                photoURL: getFileURL(user.value.photoURL),
            })
                .then (() => {
                    formLoading.value = false;
                    form.value.message ='';
                });
        }

        return {
            formLoading,
            form,
            user,
            handleSubmit,
        }
    }
</script>

<template>
    <section class="p-3">
        <div class="row">
            <div class="col-3 d-flex justify-content-center align-items-center">
            <router-link :to="`/home`">
                <img src="../../assets/img/flecha-izquierda.png" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
            </div>
            <div class="col-9 d-flex align-items-center">
                <h1 class="text-center">Mensajes</h1>
            </div>
        </div>
    </section>
    <section class="p-3">
        <div class="row">
            <div class="col-12">
                <Loader v-if="initialLoading"/>
                <ul v-else class="list-unstyled">
                    <li
                        v-for="message in messages"
                        class="mb-3"
                    >
                        <b>
                            <template v-if="message.userId !== user.id">  
                                <Image :src="message.photoURL" class="rounded-circle foto-perfil img-thumbnail" />
                                <router-link
                                    :to="`/usuario/${message.userId}`"
                                    class="text-blue-400 underline"
                                >{{ message.displayName }}</router-link>
                            </template>
                            <template v-else>
                                <Image :src="user.photoURL" class="rounded-circle foto-perfil img-thumbnail" />
                                {{ message.displayName }}
                            </template>
                            dijo:
                        </b>
                        {{ message.message }}
                        <div
                            v-if="message.created_at"
                            class="font-date"
                        >{{ dateToString(message.created_at) }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <section class="p-3 fixed-bottom">
        <div class="row">
            <div class="col-12 m-bottom">
                <form
                action="#"
                method="POST"
                id="form-message"
                @submit.prevent="handleSubmit"
                >
                    <div class="mb-3">
                        <p class="mb-2 fw-bold">Usuario</p>
                        <p>{{ user.email }}</p>
                    </div>
                    <div class="mb-3">
                        <Label for="message" class="fw-bold">Mensaje</Label>
                        <Textarea
                        id="message"
                        v-model="form.message"
                        ></Textarea>
                    </div>
                    <Button class="btn btn-primary w-100" />
                </form>
    
                <div 
                v-if="formLoading"  
                class="mb-3"
                > Enviando mensaje...</div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    img {
        width: 80%;
    }
    .m-bottom {
        margin-bottom: 4em;
    }

    .font-date {
        font-size: 0.7rem;
    }

    .foto-perfil {
        width: 20%;
    }
</style> -->

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getChatsByUser, getMessagesByChat } from "../services/chat.js";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import cardChats from "../components/cardChats.vue";
import { useRouter } from "vue-router";

const { user } = useAuth();
const chats = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    if (user.value) {
      chats.value = await getChatsByUser(user.value.id);
      getMessagesByChat
    }
  } catch (error) {
    console.error("Error getting chats: ", error);
  } finally {
    loading.value = false;
  }
});

function goToChat(chat) {
  const otherUserId = Object.keys(chat.users).find(id => id !== user.value.id);
  router.push(`/usuario/${otherUserId}/chat`);
}
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage title="chats" route="home" />
  <Section>
    <div>
      <ul>
        <li v-for="chat in chats" :key="chat.id" @click="goToChat(chat)">
          <cardChats :chat="chat" :userAuthenticatedID="user?.id" />
        </li>
      </ul>
    </div>
  </Section>
</template>

<style scoped>
img {
  width: 80%;
}

.m-bottom {
  margin-bottom: 4em;
}

.font-date {
  font-size: 0.7rem;
}

.foto-perfil {
  width: 20%;
}
ul{
  list-style: none;
  padding: 0;
  margin: 0;
}
li{
  margin: 0 0 1rem 0;
}
</style>