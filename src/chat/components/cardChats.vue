<script setup>
import { ref, onMounted } from "vue";
import { dateToString } from "../../helpers/date.js";
import { recortarString } from "../../helpers/text.js";
const props = defineProps({
    chat: Object,
    userAuthenticatedID: String
});
const chat = ref(null);
const userAuth = ref(null);
onMounted(() => {
    chat.value = props.chat;
    console.log(chat.value)
    userAuth.value = props.userAuthenticatedID;
});
const getUserDisplayName = (users) => {
    if (!users || !userAuth.value) return "";
    const otherUserId = Object.keys(users).find(id => id !== userAuth.value);
    return otherUserId ? users[otherUserId].displayName || users[otherUserId].nombre : '';
};
// const getLastMessage = (messages) => {
//     if (!messages || messages.length === 0) return "No messages yet";
//     return messages[messages.length - 1].message;
// };

const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return "No messages yet";
    
    // Ordenar los mensajes por fecha ascendente
    const sortedMessages = messages.sort((a, b) => {
        const dateA = new Date(a.created_at.seconds * 1000 + a.created_at.nanoseconds / 1000000);
        const dateB = new Date(b.created_at.seconds * 1000 + b.created_at.nanoseconds / 1000000);
        return dateA - dateB;
    });
    
    return sortedMessages[sortedMessages.length - 1].message;
};

const getLastMessageTime = (messages) => {
    if (!messages || messages.length === 0) return "";
    const createdAt = messages[messages.length - 1].created_at;
    const milliseconds = createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return dateToString(date);
};
</script>
<template>
    <div class="card">
        <div class="card-header">
            {{ getUserDisplayName(chat?.users) }}
        </div>
        <div class="card-body">
            <p class="card-text">{{ getLastMessage(chat?.messages) }}</p>
        </div>
        <div class="card-footer text-end">
            {{ getLastMessageTime(chat?.messages) }}
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 0.5rem;
    background-color: #f8f9fa;
}

.card-text{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
