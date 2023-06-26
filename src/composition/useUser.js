import { ref } from "vue";
import { getUserById } from "../services/users.js";
import { getFileURL } from "../services/storage.js";

export function useUser(id) {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        // career: null,
        photoURL: null,
        nombre: null,
        apellido: null,
        nacimiento: null,
        genero: null,
        nivel: null,
        barrio: null,
        telefono: null,
        terminos: false,
    });

    const loading = ref(true);

    loadUser();

    async function loadUser() {
        const userData = await getUserById(id);
        user.value = userData;
        user.value.photoURL = await getFileURL(userData.photoURL);
        loading.value = false;
    }

    return {
        user,
        loading,
    }
}