<script setup>
import { onMounted, provide, ref, watch } from "vue";
import Notification from "./components/Notification.vue";
import { notificationProvider } from "./symbols/symbols.js";
import Navbar from "./components/Navbar.vue";
import { useAuth } from "./composition/useAuth.js";

const { user } = useAuth();

const flagNavbar = ref(false);

onMounted(() => {
})
const feedback = ref({
    message: "",
    type: "",
    title: "",
    closable: true,
});

watch(user, (newVal, oldVal) => {
  if (newVal?.id != null) {
    flagNavbar.value = true;
  }else{
    flagNavbar.value = false;
  }
});
function setFeedbackMessage({ message, type = "success", title = "" }) {
    feedback.value = {
        ...feedback.value,
        message,
        type,
        title,
    }
    setTimeout(() => {
        clearFeedbackMessage()
    }, 5000);
}

function clearFeedbackMessage() {
    feedback.value = {
        ...feedback.value,
        message: "",
        type: "",
        title: "",
    }
}

provide(notificationProvider, {
    feedback,
    setFeedbackMessage,
    clearFeedbackMessage,
});

</script>
<template>
    <div class="layout">
        <header>
            <Notification :data="feedback" @close="clearFeedbackMessage" />
        </header>
        <main>
            <router-view />
        </main>
        <footer v-show="flagNavbar" style="padding-bottom: 53px;">
            <Navbar />
        </footer>
    </div>
</template>
<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}

main {
    flex: 1;
    overflow-y: auto;
    height: 100vh;
}
</style>
