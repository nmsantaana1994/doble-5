<script setup> 
    import { dateToString } from "../helpers/date.js";
    import { subscribeToChatMessages, sendMessage } from "../services/chat.js";
    import Button from "../components/Button.vue";
    import Label from "../components/Label.vue";
    import Textarea from "../components/Textarea.vue";
    import {ref, onMounted, onUnmounted} from "vue";
    import {useAuth} from "../composition/useAuth.js"

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
    <h1 class="text-4xl mb-4">Chat</h1>

    <div class="flex justify-between gap-4">
          <div class="w-9/12">
            <p v-if="initialLoading">Cargando...</p>
            <ul v-else>
                <li
                    v-for="message in messages"
                    class="mb-3"
                >
                    <b>
                        <template v-if="message.userId !== user.id">
                            <router-link
                                :to="`/usuario/${message.userId}`"
                                class="text-blue-400 underline"
                            >{{ message.displayName }}</router-link>
                        </template>
                        <template v-else>
                            {{ message.displayName }}
                        </template>
                        dijo:
                    </b>
                    {{ message.message }}
                    <div
                        v-if="message.created_at"
                        class="text-xs"
                    >{{ dateToString(message.created_at) }}</div>
                </li>
            </ul>
          </div>
          <div class="w-3/12">
              <form
                action="#"
                method="POST"
                id="form-message"
                @submit.prevent="handleSubmit"
              >
                  <div class="mb-3">
                      <p class="mb-2">Usuario</p>
                      <p>{{ user.email }}</p>
                  </div>
                  <div class="mb-3">
                      <Label for="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        v-model="form.message"
                      ></Textarea>
                  </div>
                  <Button full />
              </form>

              <div 
                v-if="formLoading"  
                class="mb-3"
              > Enviando mensaje...</div>
          </div>
      </div>
</template>