<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { getChatsByUser } from "../services/chat.js";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from "../../components/Loading.vue";
import cardChats from "../components/cardChats.vue";
import { useRouter } from "vue-router";
import { getAllUsers } from "../../services/users.js";

const { user } = useAuth();
const chats = ref([]);
const loading = ref(true);
const router = useRouter();

const searchTerm = ref("");

// onMounted(async () => {
//   try {
//     if (user.value) {
//       chats.value = await getChatsByUser(user.value.id);
//       console.log(chats.value);
//     }
//   } catch (error) {
//     console.error("Error getting chats: ", error);
//   } finally {
//     loading.value = false;
//   }
// });

const allUsers = ref([]);

onMounted(async () => {
  try {
    if (user.value) {
      chats.value = await getChatsByUser(user.value.id);
      allUsers.value = await getAllUsers();
      console.log("allUsers", allUsers.value);
      allUsers.value = allUsers.value.filter((u) => u.id !== user.value.id);
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    loading.value = false;
  }
});

// function goToChat(chat) {
//   const otherUserId = Object.keys(chat.users).find(
//     (id) => id !== user.value.id
//   );
//   router.push(`/usuario/${otherUserId}/chat`);
// }

function goToChat(chat) {
  const otherUserId = Object.keys(chat.users).find(
    (id) => id !== user.value.id
  );

  if (chat.id) {
    // chat ya existente
    router.push(`/usuario/${otherUserId}/chat`);
  } else {
    // iniciar un nuevo chat
    router.push(`/usuario/${otherUserId}/chat?nuevo=true`);
  }
}

// const filteredChats = computed(() => {
//   if (!searchTerm.value) return chats.value;

//   const term = searchTerm.value.toLowerCase().trim();

//   return chats.value.filter((chat) => {
//     const otherUser = Object.entries(chat.users).find(
//       ([id]) => id !== user.value.id
//     );

//     const nombre = otherUser?.[1]?.nombre?.toLowerCase() || "";
//     const displayName = otherUser?.[1]?.displayName?.toLowerCase() || "";

//     return nombre.includes(term) || displayName.includes(term);
//   });
// });
const filteredChats = computed(() => {
  if (!searchTerm.value) return chats.value;

  const term = searchTerm.value.toLowerCase().trim();

  const chatUserIds = chats.value.map((chat) =>
    Object.keys(chat.users).find((id) => id !== user.value.id)
  );

  // Usuarios que coinciden con búsqueda
  const matchingUsers = allUsers.value.filter((u) => {
    const name = u.nombre?.toLowerCase() || "";
    const displayName = u.displayName?.toLowerCase() || "";
    return name.includes(term) || displayName.includes(term);
  });

  // Dividir entre usuarios con chat y sin chat
  const usersWithChat = matchingUsers.filter((u) => chatUserIds.includes(u.id));
  const usersWithoutChat = matchingUsers.filter(
    (u) => !chatUserIds.includes(u.id)
  );

  // Convertir usuarios con chat a su chat correspondiente
  const chatsMatching = chats.value.filter((chat) => {
    const otherUserId = Object.keys(chat.users).find(
      (id) => id !== user.value.id
    );
    return usersWithChat.some((u) => u.id === otherUserId);
  });

  // Convertir usuarios sin chat a "fake chats" para mostrar
  const fakeChats = usersWithoutChat.map((userData) => ({
    id: null,
    isNew: true,
    users: {
      [user.value.id]: { nombre: user.value.nombre },
      [userData.id]: {
        nombre: userData.nombre,
        displayName: userData.displayName,
      },
    },
  }));

  return [...chatsMatching, ...fakeChats];
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
