<!-- <script setup>
import { ref, watch, defineEmits } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { inject } from "vue";
import { updateUserProfile } from "../../services/auth.js";
import { notificationProvider } from "../../symbols/symbols.js";
import Image from "../../components/Image.vue";
import Input from "../../components/Input.vue";
import Label from "../../components/Label.vue";
import Button from "../../components/Button.vue";

const { user } = useAuth();
const { setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);
const emit = defineEmits(["photoUpdated"]); // Define the event to emit

const form = ref({
  displayName: "",
  nombre: "",
  apellido: "",
  email: "",
  nacimiento: "",
  followers: [],
  following: [],
  nivel: "",
  valoraciones: "",
  genero: "",
  barrio: "",
  telefono: "",
  photoURL: null,
});

watch(user, (newUser) => {
  form.value.displayName = newUser.displayName;
  form.value.nombre = newUser.nombre;
  form.value.apellido = newUser.apellido;
  form.value.email = newUser.email;
  form.value.nacimiento = newUser.nacimiento;
  form.value.followers = newUser.followers;
  form.value.following = newUser.following;
  form.value.valoracion = newUser.valoracion;
  form.value.comentario = newUser.comentario;
  form.value.genero = newUser.genero;
  form.value.barrio = newUser.barrio;
  form.value.telefono = newUser.telefono;
});
const loading = ref(false);

// async function handleSubmit() {
//   loading.value = true;
//   try {
//     clearFeedbackMessage();
//     console.log("Valores en form:", form.value);
//     await updateUserProfile(user.value.id, {
//       ...form.value,
//     });
//     setFeedbackMessage({
//       type: "success",
//       message: "La foto de perfil fue actualizada con éxito.",
//     });
//     form.value.photoURL = null;
//     emit("photoUpdated", true); // Emit the event with the boolean value
//   } catch (err) {
//     console.error("[handleSubmit] Error al actualizar la foto de perfil", err);
//     setFeedbackMessage({
//       type: "error",
//       message:
//         "Ocurrió un error inesperado al tratar de actualizar la foto de perfil.",
//     });
//   } finally {
//     loading.value = false;
//     // location.reload();
//   }
// }

// changePhoto.vue (solo la parte relevante)
async function handleSubmit() {
  loading.value = true;
  try {
    clearFeedbackMessage();
    // Solo enviamos photoURL: así no mandamos campos indefinidos
    await updateUserProfile(user.value.id, {
      photoURL: form.value.photoURL,
    });
    setFeedbackMessage({
      type: "success",
      message: "La foto de perfil fue actualizada con éxito.",
    });
    // Emito la URL limpia al padre
    emit("photoUpdated", form.value.photoURL);
  } catch (err) {
    console.error("[handleSubmit] Error al actualizar la foto de perfil", err);
    setFeedbackMessage({
      type: "error",
      message:
        "Ocurrió un error inesperado al tratar de actualizar la foto de perfil.",
    });
  } finally {
    loading.value = false;
    // flagChangePhoto.value = false;
  }
}

async function handleFile(ev) {
  const file = ev.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    form.value.photoURL = reader.result;
  });

  reader.readAsDataURL(file);
}

function sentEmit() {}
</script>

<template>
  <div class="row d-flex">
    <div class="col-12">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <Label for="photoURL" class="fw-bold">Foto de Perfil: </Label>
          <Input type="file" id="photoURL" @change="handleFile" />
        </div>
        <div v-if="form.photoURL !== null" class="mb-3">
          <p class="mb-3 fw-bold">Previsualización de la imagen:</p>
          <Image
            :src="form.photoURL"
            :alt="'Previsualización foto de perfil'"
            class="w-100"
          />
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
          <Button class="btn btn-primary w-100" @click="sentEmit">
            Actualizar mi foto
          </Button>
        </div>
      </form>
    </div>
  </div>
</template> -->

<!-- <script setup>
import { ref, defineEmits, inject } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { updateUserPhoto } from "../../services/users.js";
import { updateUserProfile } from "../../services/auth.js";
import { notificationProvider } from "../../symbols/symbols.js";

import Label from "../../components/Label.vue";
import Input from "../../components/Input.vue";
import Button from "../../components/Button.vue";

const { user } = useAuth();
const { setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
const emit = defineEmits(["preview", "saved"]);

const form = ref({ photoURL: null });
const loading = ref(false);

function handleFile(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    form.value.photoURL = reader.result;
    // Emito preview
    emit("preview", reader.result);
  });
  reader.readAsDataURL(file);
}

async function handleSubmit() {
  if (!form.value.photoURL) return;
  loading.value = true;
  clearFeedbackMessage();
  try {
    const newUrl = await updateUserPhoto(user.value.id, form.value.photoURL);
    // 1. Actualizo el contexto global de user
    user.value.photoURL = newUrl;

    setFeedbackMessage({
      type: "success",
      message: "La foto de perfil fue actualizada con éxito.",
    });

    // 2. Disparo evento global para replicar el comportamiento de UserProfileForm.vue
    const evt = new CustomEvent("profile-updated");
    window.dispatchEvent(evt);

    emit("saved", newUrl);
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
      <Button class="btn btn-primary w-100" type="submit" :loading="loading">
        Actualizar mi foto
      </Button>
    </div>
  </form>
</template> -->






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
const { setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
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
      nombre:      user.value.nombre,
      apellido:    user.value.apellido,
      email:       user.value.email,
      nacimiento:  user.value.nacimiento,
      followers:   user.value.followers,
      following:   user.value.following,
      valoraciones:user.value.valoraciones,
      genero:      user.value.genero,
      barrio:      user.value.barrio,
      telefono:    user.value.telefono,
      photoURL:    form.value.photoURL,
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
      <Button class="btn btn-primary w-100" type="submit" :loading="loading">
        Actualizar mi foto
      </Button>
    </div>
  </form>
</template>
