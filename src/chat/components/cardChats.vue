<script setup>
import { ref, onMounted } from "vue";
import { dateToString } from "../../helpers/date.js";
import { recortarString } from "../../helpers/text.js";
import { format } from "date-fns";

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

const getUserPhotoURL = (users) => {
    if (!users || !userAuth.value) return "";
    const otherUserId = Object.keys(users).find(id => id !== userAuth.value);
    return otherUserId ? users[otherUserId].photoURL || '' : '';
};

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
    
    return format(date, "HH:mm"); // Solo hora y minuto
};
</script>
<template>
    <div class="card d-flex flex-row align-items-center p-2">
        <div class="col-2 col-md-1">
            <img :src="getUserPhotoURL(chat?.users)" alt="User Photo" class="user-photo">
        </div>
        <div class="col-10 col-md-11">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="h6 mb-0">{{ getUserDisplayName(chat?.users) }}</p>
                    <small class="text-muted">{{ getLastMessageTime(chat?.messages) }}</small>
                </div>
                <p class="card-text mb-0">{{ getLastMessage(chat?.messages) }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 0.5rem;
    background-color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}

.user-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.card-text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

h5 {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
}

small {
    font-size: 0.875rem;
}
</style>
