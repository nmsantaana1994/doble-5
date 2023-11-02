import { sendMessage } from "../services/chat.js";
import { ref } from "vue";
import { useAuth } from "../composition/useAuth.js";
import { getFileURL } from "../services/storage.js";

export function useChatForm() {
const form = ref({
message: "",
});
const formLoading = ref(false);
const { user } = useAuth();

function handleSubmit() {
formLoading.value = true;
await sendMessage({
userId: user.value.id,
email: user.value.email,
displayName: user.value.displayName || user.value.email,
message: form.value.message,
photoURL: getFileURL(user.value.photoURL),
})
.then(() => {
formLoading.value = false;
form.value.message = '';
});
}

return {
formLoading,
form,
user,
handleSubmit,
};
}
