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
                    <Textarea
                        id="message"
                        v-model="fields.message"
                        rows="1"
                    ></Textarea>
                </div>
                <Button
                    class="w-50"
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
    background-color: #f0f0f0;
    position: fixed;
    bottom: 56px; /* Adjusted to account for the navbar height */
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem;
    left: 0;
    border-top: 1px solid #ddd;
}

.textarea__message form {
    display: flex;
    flex: 1;
    align-items: center;
}

.textarea__message form textarea {
    flex: 1;
    border: none;
    padding: 0.5rem;
    border-radius: 20px;
    resize: none;
    margin-right: 0.5rem;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.textarea__message form button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
}

.textarea__message form button:disabled {
    background-color: grey;
    cursor: not-allowed;
}
</style>
