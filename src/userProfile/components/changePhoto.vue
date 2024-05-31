<script setup>
import { ref, watch } from "vue";
import { useAuth } from "../../composition/useAuth.js";
import { inject } from "vue";
import { updateUserProfile } from "../../services/auth.js";
import { notificationProvider } from "../../symbols/symbols.js";
import Image from "../../components/Image.vue";

const { user } = useAuth();
const { setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const form = ref({
  displayName: "",
  nombre: "",
  apellido: "",
  email: "",
  nacimiento: "",
  followers: [],
  following: [],
  nivel: "",
  genero: "",
  barrio: "",
  telefono: "",
  photoURL: null,
});

watch(user, newUser => {
  form.value.displayName = newUser.displayName;
  form.value.nombre = newUser.nombre;
  form.value.apellido = newUser.apellido;
  form.value.email = newUser.email;
  form.value.nacimiento = newUser.nacimiento;
  form.value.followers = newUser.followers;
  form.value.following = newUser.following;
  form.value.nivel = newUser.nivel;
  form.value.genero = newUser.genero;
  form.value.barrio = newUser.barrio;
  form.value.telefono = newUser.telefono;
});
const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    clearFeedbackMessage();
    console.log("Valores en form:", form.value);
    await updateUserProfile(user.value.id, {
      ...form.value
    });
    setFeedbackMessage({
      type: "success",
      message: "La foto de perfil fue actualizada con éxito.",
    });
    form.value.photoURL = null;
  } catch (err) {
    console.error("[handleSubmit] Error al actualizar la foto de perfil", err);
    setFeedbackMessage({
      type: "error",
      message: "Ocurrió un error inesperado al tratar de actualizar la foto de perfil.",
    });
  } finally {
    loading.value = false;
    // location.reload();
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

function sentEmit(){
  
}
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
          <Image :src="form.photoURL" :alt="'Previsualización foto de perfil'" class="w-100" />
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
          <Button class="btn btn-primary w-100" @click="sentEmit">
            Actualizar mi foto
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
