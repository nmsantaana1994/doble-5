<script setup>
import { useRoute } from "vue-router";
import { useUser } from "../../composition/useUser.js";
import Button from "../../components/Button.vue";
import Label from "../../components/Label.vue";
import Textarea from "../../components/Textarea.vue";
import { useAuth } from "../../composition/useAuth.js";
import { onUnmounted, ref, watch, nextTick } from "vue";
import {
  sendPrivateMessage,
  subscribeToPrivateChat,
  getPrivateChatRef,
} from "../services/private-chats.js";
import HeaderChat from "../components/HeaderChat.vue";
import Section from "../../components/Section.vue";
import Loading from "../../components/Loading.vue";
import cardMessage from "../components/cardMessage.vue";
import {
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../services/firebase.js";

const route = useRoute();
const { user: otherUser, loading } = useUser(route.params.id);
const { user: authUser } = useAuth();
const messagesContainerRef = ref(null);
const isOtherUserOnline = ref(false);

const { handleSubmit, fields, formLoading } = usePrivateChatForm(
  authUser,
  otherUser
);
const {
  messages,
  loading: loadingMessages,
  chatId,
} = usePrivateChat(authUser, otherUser);

function usePrivateChat(authUser, otherUser) {
  const loading = ref(true);
  const messages = ref([]);
  const chatId = ref(null);
  let unsubscribe = () => {};

  watch(otherUser, async (newOtherUser) => {
    if (newOtherUser.id != null) {
      const chatRef = await getPrivateChatRef(
        authUser.value.id,
        newOtherUser.id
      );
      chatId.value = chatRef.id;
      setSubscription();
      subscribeToPresence();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(
      authUser.value.id,
      otherUser.value.id,
      (newMessages) => {
        messages.value = newMessages;
        loading.value = false;
        scrollToBottom();
      }
    );
  }

  function scrollToBottom() {
    nextTick(() => {
      messagesContainerRef.value.scrollTop =
        messagesContainerRef.value.scrollHeight;
    });
  }

  let unsubscribePresence = () => {};

  async function subscribeToPresence() {
    const chatRef = await getPrivateChatRef(
      authUser.value.id,
      otherUser.value.id
    );
    const presenceDocRef = doc(db, "private-chats", chatRef.id);

    unsubscribePresence = onSnapshot(presenceDocRef, (docSnap) => {
      const presenceData = docSnap.data()?.presence || {};
      isOtherUserOnline.value = presenceData[otherUser.value.id] || false;
    });
  }

  onUnmounted(() => {
    unsubscribe();
    unsubscribePresence();
  });

  return {
    loading,
    messages,
    chatId,
  };
}

function usePrivateChatForm(authUser, otherUser) {
  const formLoading = ref(false);
  const fields = ref({
    message: "",
  });

  async function handleSubmit() {
    formLoading.value = true;

    try {
      await sendPrivateMessage(
        authUser.value.id,
        otherUser.value.id,
        fields.value.message
      );
      formLoading.value = false;
      fields.value.message = "";
    } catch (err) {
      console.error("[PrivateChat]", err);
    }
  }

  return {
    formLoading,
    fields,
    handleSubmit,
  };
}

// Gestión de presencia al entrar y salir del chat
async function setUserOnlineStatus(online) {
  if (!authUser.value || !otherUser.value) return;

  const chatRef = await getPrivateChatRef(
    authUser.value.id,
    otherUser.value.id
  );
  const docRef = doc(db, "private-chats", chatRef.id);

  await updateDoc(docRef, {
    [`presence.${authUser.value.id}`]: online,
    [`users.${authUser.value.id}`]: true, // asegura mantener esta info
    [`lastSeen.${authUser.value.id}`]: serverTimestamp(),
  });
}

watch([authUser, otherUser], async ([newAuthUser, newOtherUser]) => {
  if (newAuthUser?.id && newOtherUser?.id) {
    await setUserOnlineStatus(true);
  }
});

onUnmounted(async () => {
  await setUserOnlineStatus(false);
});
</script>

<template>
  <HeaderChat :otherUser="otherUser" :isOnline="isOtherUserOnline" />
  <Section>
    <Loading :loading="loading" />
    <div class="messages-wrapper" ref="messagesContainerRef">
      <ul class="mb-0">
        <li
          v-for="message in messages"
          :key="message.id"
          class="mb-1"
          :class="{ 'text-end': message.userId == authUser.id }"
        >
          <cardMessage
            :message="message"
            :userName="
              message.userId === authUser.id
                ? authUser.displayName || authUser.nombre
                : otherUser.displayName || otherUser.nombre
            "
            :messageClass="
              message.userId === authUser.id
                ? 'message-sent'
                : 'message-received'
            "
          />
        </li>
      </ul>
    </div>

    <!-- ChatInput.vue (o directamente en PrivateChat.vue) -->
    <div class="chat-input bg-light p-2 border-top mb-3">
      <form @submit.prevent="handleSubmit" class="d-flex align-items-end">
        <!-- Área de texto -->
        <div class="flex-grow-1 me-2">
          <textarea
            v-model="fields.message"
            rows="1"
            class="form-control chat-textarea"
            placeholder="Escribe un mensaje..."
          ></textarea>
        </div>

        <!-- ... dentro de <form> ... -->
        <button
          type="submit"
          class="btn btn-primary d-flex align-items-center justify-content-center position-relative"
          :disabled="!fields.message || formLoading"
        >
          <!-- Si estamos enviando, muestro spinner; si no, ícono -->
          <template v-if="formLoading">
            <span
              class="spinner-border spinner-border-sm text-light"
              role="status"
            >
              <span class="visually-hidden">Enviando…</span>
            </span>
          </template>
          <template v-else>
            <i class="bi bi-send-fill"></i>
          </template>
        </button>

        <!-- Botón enviar -->
        <!-- <button
                    type="submit"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    :disabled="!fields.message || formLoading"
                    >
                    <i class="bi bi-send-fill"></i>
                    </button> -->

        <!-- Spinner pequeño para “enviando” -->
        <!-- <div v-if="formLoading" class="ms-2"> -->
        <!-- <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Enviando…</span>
                    </div> -->
        <!-- </div> -->
      </form>
    </div>
  </Section>
</template>

<style scoped>
ul {
  list-style: none;
  /* padding: 0 0 100px 0;*/
}
.font-date {
  font-size: 0.7rem;
}

.chat-input {
  position: fixed;
  bottom: 56px; /* ajusta si tu navbar inferior cambia */
  width: 100%;
  left: 0;
  z-index: 10;
}

.chat-textarea {
  resize: none;
  border-radius: 20px;
  /* padding: 0.75rem 1rem; */
  /* Opcional: ajustar altura mínima */
  min-height: 40px;
  max-height: 100px;
  overflow-y: auto;
}

.btn-primary {
  width: 2.5rem; /* fija ancho */
  height: 2.5rem; /* fija alto para mantenerlo cuadrado */
  padding: 0; /* quita padding interno */
  border-radius: 50%; /* lo deja redondo */
  background-color: #75ab11;
}

.btn-primary i,
.btn-primary .spinner-border {
  font-size: 1.2rem;
  /* centrado vertical y horizontal gracias a d-flex y align-items/justify-content */
}

.form-control:focus {
  box-shadow: none;
  border-color: var(--bs-primary);
}

.messages-wrapper {
  /* altura hasta justo encima del chat-input */
  max-height: calc(100vh - 165px);
  overflow-y: auto;
  overflow-x: hidden; /* quita scroll horizontal */
  padding-bottom: 50px; /* deja espacio para el chat-input */
}

/* opcional: que el UL ocupe todo el ancho y evite gaps */
.messages-wrapper ul {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
