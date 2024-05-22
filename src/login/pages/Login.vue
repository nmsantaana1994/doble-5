<script setup>
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import { login } from "../../services/auth.js";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { notificationProvider } from "../../symbols/symbols.js";
import useVuelidate from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const router = useRouter();

const fields = ref({
    email: "",
    password: "",
});

const rules = {
    email: { required, email },
    password: { required, minLength: minLength(8) },
};

const v$ = useVuelidate(rules, fields);

const loading = ref(false);

async function handleSubmit() {
    loading.value = true;
    clearFeedbackMessage();

    v$.value.$touch(); // Marca todos los campos como tocados para mostrar errores

    if (v$.value.$invalid) {
        loading.value = false;
        return;
    }

    try {
        await login({
            ...fields.value,
        });

        setFeedbackMessage({
            type: "success",
            message: "¡Hola de nuevo! Te extrañamos.",
        });

        router.push('/home');
    } catch (err) {
        setFeedbackMessage({
            type: "error",
            message: err.message,
        });
    } finally {
        loading.value = false;
    }
}
</script>
<template>
    <section class="p-4">
        <h1 class="my-2 text-center">Iniciar Sesión</h1>

        <div class="d-flex justify-content-center mb-5">
            <img src="../../assets/img/logo-original.png" alt="Logo Doble-5" class="ancho-logo my-5" />
        </div>

        <div class="row mb-5">
            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <Input type="email" name="email" id="email" placeholder="E-mail" v-model="fields.email" />
                    <span v-if="v$.email.$error" class="text-danger">Por favor, ingrese un Email válido.</span>
                </div>
                <div class="mb-4">
                    <Input type="password" name="password" id="password" placeholder="Contraseña" class="mb-4"
                        v-model="fields.password" />
                    <span v-if="v$.password.$error" class="text-danger">La contraseña es obligatoria y debe tener al
                        menos 8 caracteres.</span>
                </div>
                <Button :disabled="loading" class="fw-semibold text-white py-3 my-2">INICIAR SESIÓN</Button>
            </form>
        </div>

        <div class="row">
            <div class="col-12 text-center mb-4">
                <a href="" class="fw-semibold">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="col-12 mt-4 d-flex justify-content-center">
                <router-link to="/registro">
                    <Button class="fw-semibold text-white py-3 px-5 register-button">CREA UNA CUENTA</Button>
                </router-link>
            </div>
        </div>
    </section>
</template>

<style scoped>
img {
    width: 80%;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    width: 100%;
    padding: .5rem;
    border: .2px solid rgb(203, 203, 203);
    border-radius: 20px;
}

form button {
    border-radius: 18px;
    background-color: #000000;
}

a {
    color: #73a812;
    text-align: center;
}

.register-button {
    border-radius: 18px;
    background-color: #73a812;
    width: 100%;
    display: inline-block;
}
</style>