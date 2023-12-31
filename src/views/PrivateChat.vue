<script setup>
import { useRoute } from "vue-router";
import { useUser } from "../composition/useUser.js";
import LoadingContext from "../components/LoadingContext.vue"
import { dateToString } from "../helpers/date.js";
import Button from "../components/Button.vue";
import Label from "../components/Label.vue";
import Textarea from "../components/Textarea.vue";
import { useAuth } from "../composition/useAuth";
import {onUnmounted, ref, watch} from "vue";
import {sendPrivateMessage, subscribeToPrivateChat} from "../services/private-chats.js";

const route = useRoute();
const {user: otherUser, loading} = useUser(route.params.id);
const {user: authUser} = useAuth();
const {handleSubmit, fields, formLoading} = usePrivateChatForm(authUser, otherUser);
const {messages, loading: loadingMessages} = usePrivateChat(authUser, otherUser);

function usePrivateChat(authUser, otherUser) {
    const loading = ref(true);
    const messages = ref([]);
    
    let unsubscribe = () => {};

   
    watch(otherUser, newOtherUser => {
        if(newOtherUser.id != null) {
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
    <section class="px-3">
        <LoadingContext :loading="loading">
            <h1 class="mb-3 text-4xl">Chat privado con {{ otherUser.email }}</h1>
    
            <div class="mb-3">
                <LoadingContext :loading="loadingMessages">
                <ul>
                    <li
                        v-for="message in messages"
                        class="mb-3"
                        :class="{
                            'text-end': message.userId == authUser.id
                        }"
                    >
                        <b>

                            <!-- TODO: Ver bien la logica para mostrar el nombre correcto de quien envia los mensajes -->
                            <template v-if="message.userId !== otherUser">
                                {{ authUser.displayName }}
                            </template>
                            <template v-else>
                                {{ otherUser.displayName }}
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
                </LoadingContext>
            </div>
            <div class="mb-3">
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
                        ></Textarea>
                    </div>
                    <Button full />
                </form>
                <div 
                    v-if="formLoading"  
                    class="mb-3"
                > Enviando mensaje...</div>
            </div>
        </LoadingContext>
    </section>
</template>

<style scoped>
    ul {
        list-style: none;
        padding: 0;
    }
</style>