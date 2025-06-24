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
      getMessagesByChat;
    }
  } catch (error) {
    console.error("Error getting chats: ", error);
  } finally {
    loading.value = false;
  }
});

function goToChat(chat) {
  const otherUserId = Object.keys(chat.users).find(
    (id) => id !== user.value.id
  );
  router.push(`/usuario/${otherUserId}/chat`);
}
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage title="Chats" route="home" />
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 0 0 0.2rem 0;
}
</style>
