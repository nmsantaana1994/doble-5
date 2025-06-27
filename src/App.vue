<script setup>
import { onMounted, provide, ref, watch } from "vue";
import { useAuth } from "./composition/useAuth.js";
import { useNotification } from "./composition/useNotification.js";
import { useModal } from "./composition/useModal.js";
import Notification from "./components/Notification.vue";
import Navbar from "./components/Navbar.vue";
import Modal from "./components/Modal.vue";
import { modalProvider, notificationProvider } from "./symbols/symbols.js";
import { useRoute } from "vue-router";

const route = useRoute();
const { user } = useAuth();
const { feedback, setFeedbackMessage, clearFeedbackMessage } =
  useNotification();
const {
  modalData,
  showModal,
  handleModalClose,
  handleModalCloseX,
  handleModalSave,
} = useModal();

const flagNavbar = ref(false);

onMounted(() => {
  const currentPath = route.fullPath;
  if (currentPath.startsWith("/info-partido/")) {
    flagNavbar.value = false;
  } else {
    flagNavbar.value = !!user.value?.id;
  }
});
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.startsWith("/info-partido/")) {
      flagNavbar.value = false;
    } else {
      flagNavbar.value = !!user.value?.id;
    }
  },
  { immediate: true }
);

provide(notificationProvider, {
  feedback,
  setFeedbackMessage,
  clearFeedbackMessage,
});

provide(modalProvider, {
  modalData,
  showModal,
});
</script>

<template>
  <div class="layout poppins-regular">
    <header>
      <Notification :data="feedback" @close="clearFeedbackMessage" />
      <Modal
        v-if="modalData.isVisible"
        :title="modalData.title"
        :bodyText="modalData.bodyText"
        :closeButtonText="modalData.closeButtonText"
        :saveButtonText="modalData.saveButtonText"
        @close="handleModalClose"
        @closex="handleModalCloseX"
        @save="handleModalSave"
      />
    </header>
    <main style="padding-bottom: 51px">
      <router-view />
    </main>
    <footer v-show="flagNavbar">
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
