<script setup>
import { ref, inject } from "vue";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import { sendResetPassword } from "../../services/auth";
import { notificationProvider } from "../../symbols/symbols.js";
import { useRouter } from "vue-router";
const { setFeedbackMessage } = inject(notificationProvider);

const email = ref("");
const mensaje = ref("");
1;
const router = useRouter();

const enviar = async () => {
  try {
    const res = await sendResetPassword(email.value);
    mensaje.value = "Revisá tu correo para cambiar la contraseña.";
    setFeedbackMessage({
      type: "success",
      message: "Solicitud de cambio de contraseña enviada correctamente.",
    });
    router.push("/iniciar-sesion");
  } catch (error) {
    setFeedbackMessage({
      type: "error",
      message: "Algo salio mal, intenta nuevamente.",
    });
  }
};
</script>

<template>
  <HeaderPage route="/iniciar-sesion" title="Olvide mi contraseña" />
  <Section>
    <h2>Reestablecer contraseña</h2>
    <input v-model="email" placeholder="Tu correo" type="email" />
    <button @click="enviar">ENVIAR ENLACE</button>
    <p>{{ mensaje }}</p>
  </Section>
</template>
<style scoped>
.container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #5d880d;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:enabled {
  background-color: #333;
}

p {
  margin-top: 1rem;
  color: #73a812;
  font-weight: 500;
}
</style>
