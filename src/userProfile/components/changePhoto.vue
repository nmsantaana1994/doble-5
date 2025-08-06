<script setup>
import { ref, defineEmits, inject } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { updateUserProfile } from "../../services/auth.js";
import { notificationProvider } from "../../symbols/symbols.js";

import Label from "../../components/Label.vue";
import Input from "../../components/Input.vue";
import Button from "../../components/Button.vue";

// Obtengo el usuario y las funciones de feedback
const { user } = useAuth();
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);
// Emit para notificar al padre cuando termine
const emit = defineEmits(["preview", "saved"]);

// Estado interno del form
const form = ref({ photoURL: null });
const loading = ref(false);

// Preview local de la imagen seleccionada
function handleFile(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    form.value.photoURL = reader.result;
    emit("preview", reader.result);
  });
  reader.readAsDataURL(file);
}

// Submit: reutiliza updateUserProfile para mantener la lógica centralizada
async function handleSubmit() {
  if (!form.value.photoURL) return;
  loading.value = true;
  clearFeedbackMessage();

  try {
    await updateUserProfile(user.value.id, {
      displayName: user.value.displayName,
      nombre: user.value.nombre,
      apellido: user.value.apellido,
      email: user.value.email,
      nacimiento: user.value.nacimiento,
      followers: user.value.followers,
      following: user.value.following,
      valoraciones: user.value.valoraciones,
      genero: user.value.genero,
      barrio: user.value.barrio,
      telefono: user.value.telefono,
      photoURL: form.value.photoURL,
    });

    setFeedbackMessage({
      type: "success",
      message: "La foto de perfil fue actualizada con éxito.",
    });

    // Notifico al componente padre que terminó el guardado
    emit("saved", true);
  } catch (err) {
    console.error("[handleSubmit] error al actualizar foto:", err);
    setFeedbackMessage({
      type: "error",
      message:
        "Ocurrió un error inesperado al tratar de actualizar la foto de perfil: " +
        (err.message || err),
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="row d-flex">
    <div class="col-12 mb-3">
      <Label for="photoURL" class="fw-bold">Foto de Perfil:</Label>
      <Input type="file" id="photoURL" @change="handleFile" />
    </div>
    <div class="col-12 d-grid gap-2">
      <Button class="btn w-100" type="submit" :loading="loading">
        ACTUALIZAR MI FOTO
      </Button>
    </div>
  </form>
</template>
