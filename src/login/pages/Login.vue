<script setup>
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import { login } from "../../services/auth.js";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { notificationProvider } from "../../symbols/symbols.js";
import Loading from "../../components/Loading.vue";
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);

const router = useRouter();

const fields = ref({
  email: "",
  password: "",
});

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  clearFeedbackMessage();

  try {
    await login({
      ...fields.value,
    });

    // setFeedbackMessage({
    //     type: "success",
    //     message: "¡Hola de nuevo! Te extrañamos.",
    // });

    router.push("/home");
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
  <Loading :loading="loading" />
  <section class="p-3">
    <div class="d-flex justify-content-center mb-4">
      <img
        src="../../assets/img/logo-original.png"
        alt="Logo Doble-5"
        class="ancho-logo my-4"
      />
    </div>

    <div class="row mb-3">
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label
            for="email"
            style="
              margin-left: 0.3rem;
              font-weight: 500;
              padding-bottom: 0.5rem;
            "
            >Email</label
          >
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            v-model="fields.email"
          />
        </div>
        <div class="mb-2">
          <label
            for="password"
            style="
              margin-left: 0.3rem;
              font-weight: 500;
              padding-bottom: 0.5rem;
            "
            >Contraseña</label
          >
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            class="mb-4"
            v-model="fields.password"
          />
        </div>
        <Button :disabled="loading" class="fw-semibold text-white py-3 my-2"
          >INICIAR SESIÓN</Button
        >
      </form>
    </div>

    <div class="row">
      <div class="col-12 text-center mb-2">
        <a href="" class="fw-semibold">¿Olvidaste tu contraseña?</a>
      </div>
      <div class="col-12 mt-3 d-flex justify-content-center">
        <router-link to="/registro">
          <Button class="fw-semibold text-white py-3 px-5 register-button"
            >CREAR UNA CUENTA</Button
          >
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
img {
  width: 70%;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 0.2px solid rgb(203, 203, 203);
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
