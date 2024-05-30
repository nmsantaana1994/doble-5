<!-- <script setup>
import { subscribeToChatMessages, sendMessage } from "../services/chat.js";
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getFileURL } from "../../services/storage.js";
import { getChatsByUser } from "../services/chat.js";
import cardChats from "../components/cardChats.vue";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import CardChats from "../components/cardChats.vue";
import { useRouter } from "vue-router";

const { user } = useAuth();
const chats = ref([]);
const loading = ref(true);
const router = useRouter();
const userAuth = ref(null)

onMounted(async () => {
    try {
        chats.value = await getChatsByUser(user.value.id);
        userAuth.value = user.value;
        console.log('userAuth', userAuth.value)
        console.log('chats', chats.value)
    } catch (error) {
        console.error("Error getting chats: ", error);
    } finally {
        loading.value = false;
    }
});

// function goToChat(chatId) {
//     router.push({ name: "ChatMessages", params: { chatId } });
// }
</script>

<template>
    <Loading :loading="loading" />
    <HeaderPage title="chats" route="home" />
    <Section>
        <div>
            <ul>
                <li v-for="chat in chats" :key="chat.id" @click="goToChat(chat.id)">
                    <CardChats :chat="chat" :userAuthenticated="user.id" />
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
</style> -->

<!-- <script setup>
import { subscribeToChatMessages, sendMessage } from "../services/chat.js";
import { ref, onMounted } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getChatsByUser } from "../services/chat.js";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import CardChats from "../components/CardChats.vue";
import { useRouter } from "vue-router";

const { user } = useAuth();
const chats = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    if (user.value) {
      chats.value = await getChatsByUser(user.value.id);
      console.log(chats.value)
    }
  } catch (error) {
    console.error("Error getting chats: ", error);
  } finally {
    loading.value = false;
  }
});

function goToChat(chatId) {
  router.push({ name: "ChatMessages", params: { chatId } });
}
</script> -->

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getChatsByUser, getMessagesByChat } from "../services/chat.js";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import CardChats from "../components/CardChats.vue";
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
          <CardChats :chat="chat" :userAuthenticatedID="user?.id" />
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
