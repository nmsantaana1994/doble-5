<!-- <script setup>
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
  <HeaderPage title="Mensajes" route="home" :hasBackground="false" />
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
</style> -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getChatsByUser } from "../services/chat.js";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import cardChats from "../components/cardChats.vue";
import { useRouter } from "vue-router";

const { user } = useAuth();
const chats = ref([]);
const loading = ref(true);
const router = useRouter();

const searchTerm = ref("");

onMounted(async () => {
  try {
    if (user.value) {
      chats.value = await getChatsByUser(user.value.id);
      console.log(chats.value);
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

const filteredChats = computed(() => {
  if (!searchTerm.value) return chats.value;

  const term = searchTerm.value.toLowerCase().trim();

  return chats.value.filter((chat) => {
    const otherUser = Object.entries(chat.users).find(
      ([id]) => id !== user.value.id
    );

    const nombre = otherUser?.[1]?.nombre?.toLowerCase() || "";
    const displayName = otherUser?.[1]?.displayName?.toLowerCase() || "";

    return nombre.includes(term) || displayName.includes(term);
  });
});
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage title="Mensajes" route="home" :hasBackground="true" />
  <Section>
    <div class="mb-3">
      <input
        type="text"
        v-model="searchTerm"
        class="form-control"
        placeholder="Buscar chat por nombre"
      />
    </div>

    <div>
      <ul>
        <li
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="goToChat(chat)"
        >
          <cardChats :chat="chat" :userAuthenticatedID="user?.id" />
        </li>
      </ul>
      <p v-if="!filteredChats.length && searchTerm">
        No se encontraron chats con ese nombre.
      </p>
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

input {
  border-radius: 12px;
  padding: 0.5rem 1rem;
}
</style>
