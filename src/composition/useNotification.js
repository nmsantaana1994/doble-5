import { ref } from "vue";

const feedback = ref({
    message: "",
    type: "",
    title: "",
    closable: true,
});

function setFeedbackMessage({ message, type = "success", title = "" }) {
    feedback.value = {
        ...feedback.value,
        message,
        type,
        title,
    }
    setTimeout(() => {
        clearFeedbackMessage();
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

export function useNotification() {
    return {
        feedback,
        setFeedbackMessage,
        clearFeedbackMessage,
    };
}