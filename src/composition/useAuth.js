import {subscribeToAuth} from "../services/auth.js";
import {ref, onMounted, onUnmounted} from "vue";

export function useAuth() {
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
    });
    let unsubscribe = () => {}

    onMounted(() => {
        unsubscribe = subscribeToAuth(newUser => user.value = newUser);
    });

    onUnmounted(()=>{
        unsubscribe();
    });

    return {
        user,
    }
}