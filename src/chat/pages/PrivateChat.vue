<!-- <script setup>
import { useRoute } from "vue-router";
import { useUser } from "../../composition/useUser.js";
import Button from "../../components/Button.vue";
import Label from "../../components/Label.vue";
import Textarea from "../../components/Textarea.vue";
import { useAuth } from "../../composition/useAuth.js";
import { onUnmounted, ref, watch } from "vue";
import {
  sendPrivateMessage,
  subscribeToPrivateChat,
} from "../services/private-chats.js";
import HeaderChat from "../components/HeaderChat.vue";
import Section from "../../components/Section.vue";
import Loading from "../../components/Loading.vue";
import cardMessage from "../components/cardMessage.vue";
const route = useRoute();
const { user: otherUser, loading } = useUser(route.params.id);
const { user: authUser } = useAuth();
const { handleSubmit, fields, formLoading } = usePrivateChatForm(
  authUser,
  otherUser
);
const { messages, loading: loadingMessages } = usePrivateChat(
  authUser,
  otherUser
);

function usePrivateChat(authUser, otherUser) {
  const loading = ref(true);
  const messages = ref([]);

  let unsubscribe = () => {};

  watch(otherUser, (newOtherUser) => {
    if (newOtherUser.id != null) {
      setSubscription();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(
      authUser.value.id,
      otherUser.value.id,
      (newMessages) => {
        messages.value = newMessages;
        loading.value = false;
      }
    );
  }

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    loading,
    messages,
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
      // TODO: Mostrar un mensaje de feedback de error.
      console.error("[PrivateChat]", err);
    }
  }

  return {
    formLoading,
    fields,
    handleSubmit,
  };
}
</script>

<template>
  <HeaderChat :otherUser="otherUser" />
  <Section>
    <Loading :loading="loading" />

    <div class="mb-3">
      <ul>
        <li
          v-for="message in messages"
          :key="message.id"
          class="mb-3"
          :class="{
            'text-end': message.userId == authUser.id,
          }"
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
    <div class="textarea__message">
      <form
        action="#"
        method="POST"
        id="form-message"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-3">
          <Label for="message">Mensaje</Label>
          <Textarea id="message" v-model="fields.message"></Textarea>
        </div>
        <Button
          class="w-100"
          :disabled="!fields.message"
          :class="!fields.message ? 'button_disabled' : ''"
        />
      </form>
      <div v-if="formLoading" class="mb-3">Enviando mensaje...</div>
    </div>
  </Section>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0 0 100px 0;
}

.font-date {
  font-size: 0.7rem;
}

.title_chat {
  position: fixed;
  width: 100%;
}
/* form {
  display: flex;
  width: 100%;
} */
textarea {
  width: 100%;
}

form button {
  background-color: var(--primary-color);
  color: white;
}

.button_disabled {
  background-color: grey;
}
.textarea__message {
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  bottom: 0;
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.2rem;
  left: 0;
}
</style> -->
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
} from "../services/private-chats.js";
import HeaderChat from "../components/HeaderChat.vue";
import Section from "../../components/Section.vue";
import Loading from "../../components/Loading.vue";
import cardMessage from "../components/cardMessage.vue";

const route = useRoute();
const { user: otherUser, loading } = useUser(route.params.id);
const { user: authUser } = useAuth();
const { handleSubmit, fields, formLoading } = usePrivateChatForm(
  authUser,
  otherUser
);
const { messages, loading: loadingMessages } = usePrivateChat(
  authUser,
  otherUser
);
const messagesContainerRef = ref(null); // Nueva referencia para el contenedor de mensajes

function usePrivateChat(authUser, otherUser) {
  const loading = ref(true);
  const messages = ref([]);

  let unsubscribe = () => {};

  watch(otherUser, (newOtherUser) => {
    if (newOtherUser.id != null) {
      setSubscription();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(
      authUser.value.id,
      otherUser.value.id,
      (newMessages) => {
        messages.value = newMessages;
        loading.value = false;
        scrollToBottom(); // Desplaza hacia abajo después de cargar nuevos mensajes
      }
    );
  }

  function scrollToBottom() {
    nextTick(() => {
      messagesContainerRef.value.scrollTop =
        messagesContainerRef.value.scrollHeight; // Desplazar hacia el final
    });
  }

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    loading,
    messages,
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
</script>

<template>
  <HeaderChat :otherUser="otherUser" />
  <Section>
    <Loading :loading="loading" />

    <div
      class="mb-3"
      ref="messagesContainerRef"
      style="max-height: calc(100vh - 165px); overflow-y: auto"
    >
      <ul>
        <li
          v-for="message in messages"
          :key="message.id"
          class="mb-3"
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

    <div class="textarea__message">
      <form
        action="#"
        method="POST"
        id="form-message"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-3">
          <Label for="message">Mensaje</Label>
          <Textarea id="message" v-model="fields.message"></Textarea>
        </div>
        <Button
          class="w-100"
          :disabled="!fields.message"
          :class="!fields.message ? 'button_disabled' : ''"
        />
      </form>
      <div v-if="formLoading" class="mb-3">Enviando mensaje...</div>
    </div>
  </Section>
</template>

<style scoped>
ul {
  list-style: none;
  /* padding-bottom: 105px; */
  padding: 0 0 100px 0;
}

.font-date {
  font-size: 0.7rem;
}

.title_chat {
  position: fixed;
  width: 100%;
}

textarea {
  width: 100%;
}

form button {
  background-color: var(--primary-color);
  color: white;
}

.button_disabled {
  background-color: grey;
}

.textarea__message {
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  bottom: 0;
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.2rem;
  left: 0;
}
</style>
