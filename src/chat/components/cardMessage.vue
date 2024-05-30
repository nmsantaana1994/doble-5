<script setup>
import { dateToString } from "../../helpers/date.js";
const props = defineProps({
    message: Object,
    userName: String,
    messageClass: String
});
</script>

<template>
    <div :class="['card-message', messageClass]">
        <div class="card-content">
            <!-- <b>{{ userName }} dijo:</b> -->
            <p>{{ message.message }}</p>
            <div v-if="message.created_at" class="font-date">{{ dateToString(message.created_at) }}</div>
        </div>
    </div>
</template>

<style scoped>
.card-message {
    padding: .5rem;
    display: inline-block;
    max-width: 80%;
    text-align: left;
    word-wrap: break-word;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    color: white;
}
.message-sent {
    background-color: rgb(63, 114, 63);
    align-self: flex-start;
}
.message-received {
    background-color: rgb(146, 146, 146);
    align-self: flex-start;
}
.font-date {
    font-size: 0.7rem;
}
</style>