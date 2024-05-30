<!-- <script setup>
import { useRoute } from "vue-router";
import { useUser } from "../../composition/useUser.js";
import Loading from "../../components/Loading.vue"
import { dateToString } from "../../helpers/date.js";
import Button from "../../components/Button.vue";
import Label from "../../components/Label.vue";
import Textarea from "../../components/Textarea.vue";
import { useAuth } from "../../composition/useAuth.js";
import { onUnmounted, ref, watch } from "vue";
import { sendPrivateMessage, subscribeToPrivateChat } from "../services/private-chats.js";
import HeaderChat from "../components/HeaderChat.vue";
import Section from '../../components/Section.vue';

const route = useRoute();
const { user: otherUser, loading } = useUser(route.params.id);
const { user: authUser } = useAuth();
const { handleSubmit, fields, formLoading } = usePrivateChatForm(authUser, otherUser);
const { messages, loading: loadingMessages } = usePrivateChat(authUser, otherUser);

function usePrivateChat(authUser, otherUser) {
    const loading = ref(true);
    const messages = ref([]);

    let unsubscribe = () => { };


    watch(otherUser, newOtherUser => {
        if (newOtherUser.id != null) {
            setSubscription();
        }
    });

    async function setSubscription() {
        unsubscribe = await subscribeToPrivateChat(
            authUser.value.id,
            otherUser.value.id,
            newMessages => {
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
    }
}

function usePrivateChatForm(authUser, otherUser) {
    const formLoading = ref(false);
    const fields = ref({
        message: "",
    });

    async function handleSubmit() {
        formLoading.value = true;

        try {
            await sendPrivateMessage(authUser.value.id, otherUser.value.id, fields.value.message);
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
    }
}

</script>

<template>
    <HeaderChat :otherUser="otherUser" />
    <Section>
        <Loading :loading="loading" />

        <div class="mb-3">
            <LoadingContext :loading="loadingMessages">
                <ul>
                    <li v-for="message in messages" :key="message.id" class="mb-3" :class="{
                        'text-end': message.userId == authUser.id,
                        'message-sent': message.userId == authUser.id,
                        'message-received': message.userId != authUser.id
                    }">
                        <b>
                            <template v-if="message.userId !== authUser.id">
                                {{ otherUser.displayName ? otherUser.displayName : otherUser.nombre }}
                            </template>
                            <template v-else>
                                {{ authUser.displayName ? authUser.displayName : authUser.nombre }}
                            </template>
                            dijo:
                        </b>
                        {{ message.message }}
                        <div v-if="message.created_at" class="font-date">{{ dateToString(message.created_at) }}
                        </div>
                    </li>
                </ul>
            </LoadingContext>
        </div>
        <div class="mb-3">
            <form action="#" method="POST" id="form-message" @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <Label for="message">Mensaje</Label>
                    <Textarea id="message" v-model="fields.message"></Textarea>
                </div>
                <Button class="btn btn-primary w-100" />
            </form>
            <div v-if="formLoading" class="mb-3"> Enviando mensaje...</div>
        </div>
    </Section>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}

.font-date {
    font-size: 0.7rem;
}

.title_chat {
    position: fixed;
    width: 100%;
}

ul li {
    padding: .3rem;
    display: inline-block; /* Para que los mensajes solo ocupen el ancho necesario */
    max-width: 80%; /* Limita el ancho máximo de los mensajes */
    word-wrap: break-word; /* Permite que las palabras largas se dividan y ajusten dentro del contenedor */
    border-radius: 10px; /* Agrega un borde redondeado */
    margin-bottom: 0.5rem; /* Espacio entre los mensajes */
}

.message-sent {
    background-color: lightgreen; /* Color de fondo para los mensajes enviados por el usuario autenticado */
    align-self: flex-end; /* Alinea a la derecha */
}

.message-received {
    background-color: lightgrey; /* Color de fondo para los mensajes recibidos de otro usuario */
    align-self: flex-start; /* Alinea a la izquierda */
}

.text-end {
    text-align: right;
}
</style> -->

<script setup>
import { useRoute } from "vue-router";
import { useUser } from "../../composition/useUser.js";
import Loading from "../../components/Loading.vue";
import Button from "../../components/Button.vue";
import Label from "../../components/Label.vue";
import Textarea from "../../components/Textarea.vue";
import { useAuth } from "../../composition/useAuth.js";
import { onUnmounted, ref, watch } from "vue";
import { sendPrivateMessage, subscribeToPrivateChat } from "../services/private-chats.js";
import HeaderChat from "../components/HeaderChat.vue";
import Section from '../../components/Section.vue';
import CardMessage from "../components/CardMessage.vue";

const route = useRoute();
const { user: otherUser, loading } = useUser(route.params.id);
const { user: authUser } = useAuth();
const { handleSubmit, fields, formLoading } = usePrivateChatForm(authUser, otherUser);
const { messages, loading: loadingMessages } = usePrivateChat(authUser, otherUser);

function usePrivateChat(authUser, otherUser) {
  const loading = ref(true);
  const messages = ref([]);

  let unsubscribe = () => { };

  watch(otherUser, newOtherUser => {
    if (newOtherUser.id != null) {
      setSubscription();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(
      authUser.value.id,
      otherUser.value.id,
      newMessages => {
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
  }
}

function usePrivateChatForm(authUser, otherUser) {
  const formLoading = ref(false);
  const fields = ref({
    message: "",
  });

  async function handleSubmit() {
    formLoading.value = true;

    try {
      await sendPrivateMessage(authUser.value.id, otherUser.value.id, fields.value.message);
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
  }
}

</script>

<template>
  <HeaderChat :otherUser="otherUser" />
  <Section>
    <Loading :loading="loading" />

    <div class="mb-3">
        <ul>
          <li v-for="message in messages" :key="message.id" class="mb-3" :class="{
                        'text-end': message.userId == authUser.id}">
            <CardMessage
              :message="message"
              :userName="message.userId === authUser.id ? authUser.displayName || authUser.nombre : otherUser.displayName || otherUser.nombre"
              :messageClass="message.userId === authUser.id ? 'message-sent' : 'message-received'"
            />
          </li>
        </ul>
    </div>
    <div class="mb-3">
      <form action="#" method="POST" id="form-message" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <Label for="message">Mensaje</Label>
          <Textarea id="message" v-model="fields.message"></Textarea>
        </div>
        <Button class="btn btn-primary w-100" :disabled="!fields.message" :class="!fields.message ? 'button_disabled' : ''"/>
      </form>
      <div v-if="formLoading" class="mb-3"> Enviando mensaje...</div>
    </div>
  </Section>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

.font-date {
  font-size: 0.7rem;
}

.title_chat {
  position: fixed;
  width: 100%;
}
textarea{
  width: 100%;
}
form button{
  background-color: var(--primary-color);
}
.button_disabled{
  background-color: grey;
}
</style>
