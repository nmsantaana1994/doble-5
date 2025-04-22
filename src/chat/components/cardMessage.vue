<script setup>
import { dateToString } from "../../helpers/date.js";
const props = defineProps({
    message: Object,
    userName: String,
    messageClass: String
});

function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('es-AR', options).format(new Date(date));
}
</script>

<template>
    <div :class="['card-message', messageClass]">
        <div class="card-content">
            <!-- <b>{{ userName }} dijo:</b> -->
            <p class="m-0">{{ message.message }}</p>
            <div v-if="message.created_at" class="font-date">{{ formatTime(message.created_at) }}</div>
        </div>
    </div>
</template>

<style scoped>
.card-message {
    padding: .5rem 1rem;
    display: inline-block;
    max-width: 80%;
    text-align: left;
    word-wrap: break-word;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    color: white;
    position: relative;
    font-size: 0.9rem;
}

.message-sent {
    background-color: #c8ff9e;
    align-self: flex-end;
    color: black;
}

.message-received {
    background-color: #e9e9e9;
    align-self: flex-start;
    color: black;
}

.font-date {
    font-size: 0.7rem;
    text-align: end;
    margin-top: 0.2rem;
    color: rgba(0, 0, 0, 0.6);
}

.card-content {
    position: relative;
}

.card-message::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #FFFFFF;
    border-bottom: 0;
    border-left: 0;
    margin-left: -10px;
    margin-bottom: -10px;
}

/* .message-sent::after {
    border-top-color: #DCF8C6;
    left: auto;
    right: -10px;
    border-left: 0;
    border-right: 10px solid transparent;
} */
</style>