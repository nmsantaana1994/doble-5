<script setup>
import Label from "../../components/Label.vue";
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import Image from "../../components/Image.vue";
import { useAuth } from "../../composition/useAuth.js";
import { inject, ref, watch } from "vue";
import LoadingContext from "../../components/LoadingContext.vue";
import { updateUserProfile } from "../../services/auth.js";
import { notificationProvider } from "../../symbols/symbols.js";

const { user } = useAuth();
const { form, loading, handleSubmit, handleFile } = useEditProfile(user);
const { feedback, setFeedbackMessage, clearFeedbackMessage } =
  inject(notificationProvider);

function useEditProfile(user) {
  const form = ref({
    displayName: "",
    nombre: "",
    apellido: "",
    email: "",
    nacimiento: "",
    followers: [],
    following: [],
    genero: "",
    barrio: "",
    telefono: "",
    photoURL: null,
    valoracion: 0, // ✔
    comentario: "", // ✔
  });

  const loading = ref(false);
  const feedback = ref({
    message: "",
    type: "success",
    title: "",
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

  async function handleSubmit() {
    loading.value = true;

    try {
      clearFeedbackMessage();
      console.log("Valores en form:", form.value);
      await updateUserProfile(user.value.id, {
        ...form.value,
      });
      loading.value = false;

      form.value.photoURL = null;

      setFeedbackMessage({
        type: "success",
        message: "La información de tu perfil fue actualizada con éxito.",
      });

      // Emitir un evento personalizado para indicar que el perfil ha sido actualizado
      const profileUpdatedEvent = new CustomEvent("profile-updated");
      window.dispatchEvent(profileUpdatedEvent);
    } catch (err) {
      console.error("[MyProfile handleSubmit]", err);

      setFeedbackMessage({
        type: "error",
        message:
          "Ocurrió un error inesperado al tratar de actualizar la información de tu perfil.",
      });
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

  return {
    form,
    loading,
    handleSubmit,
    handleFile,
  };
}
</script>

<template>
  <div class="row d-flex">
    <div class="col-12 mb-3 d-flex justify-content-center">
      <div class="w-50">
        <Image :src="user.photoURL" />
      </div>
    </div>
    <div class="col-12">
      <form action="#" method="POST" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <Label for="displayName" class="me-3 fw-bold">NOMBRE DE USUARIO:
          </Label>
          <Input id="displayName" v-model="form.displayName" />
        </div>
        <div class="mb-3">
          <Label for="nombre" class="me-3 fw-bold">NOMBRE: </Label>
          <Input id="nombre" v-model="form.nombre" />
        </div>
        <div class="mb-3">
          <Label for="apellido" class="me-3 fw-bold">APELLIDO: </Label>
          <Input id="apellido" v-model="form.apellido" />
        </div>
        <div class="mb-3">
          <Label for="email" class="me-3 fw-bold">EMAIL: </Label>
          <Input id="Email" v-model="form.email" />
        </div>
        <div class="mb-3">
          <Label for="nacimiento" class="me-3 fw-bold">FECHA DE NACIMIENTO:
          </Label>
          <Input type="date" id="nacimiento" v-model="form.nacimiento" />
        </div>
        <!-- <div class="mb-3">
          <Label for="nivel" class="me-3 fw-bold">Nivel de Juego: </Label>
          <Input id="nivel" v-model="form.nivel" />
        </div> -->

        <div class="mb-3">
          <Label class="me-3 fw-bold">VALORACIONES</Label>
          <div class="estrellas-editables">
            <span
              v-for="n in 5"
              :key="n"
              class="estrella"
              :class="{ activa: n <= form.valoracion }"
              @click="form.valoracion = n"
              >★</span
            >
          </div>
        </div>

        <div class="mb-3">
          <Label for="comentario" class="me-3 fw-bold">COMENTARIO:</Label>
          <textarea
            id="comentario"
            v-model="form.comentario"
            rows="3"
            class="form-control"
            placeholder="¿Qué tipo de jugador sos?"
          ></textarea>
        </div>

        <div class="mb-3">
          <Label for="genero" class="me-3 fw-bold">GÉNERO: </Label>
          <Input id="genero" v-model="form.genero" />
        </div>
        <div class="mb-3">
          <Label for="barrio" class="me-3 fw-bold">BARRIO: </Label>
          <Input id="barrio" v-model="form.barrio" />
        </div>
        <div class="mb-3">
          <Label for="telefono" class="me-3 fw-bold">TELÉFONO: </Label>
          <Input id="telefono" v-model="form.telefono" />
        </div>
        <div class="mb-3">
          <Label for="photoURL" class="fw-bold">FOTO DE PERFIL: </Label>
          <Input type="file" id="photoURL" @change="handleFile" />
        </div>
        <div v-if="form.photoURL !== null" class="mb-3">
          <p class="mb-3 fw-bold">Previsualización de la imagen:</p>
          <img
            :src="form.photoURL"
            alt="Previsualización foto de perfil"
            class="w-100"
          />
        </div>
        <Button class="btn btn-primary w-100">
          <LoadingContext :loading="loading">
            Actualizar mis datos
          </LoadingContext>
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.estrellas-editables {
  font-size: 24px;
  cursor: pointer;
  user-select: none;
}

.estrella {
  color: lightgray;
  transition: color 0.2s;
}

.estrella.activa {
  color: gold;
}
</style>
