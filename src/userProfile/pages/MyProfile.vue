<script setup>
import { useAuth } from "../../composition/useAuth.js";
import UserProfileForm from "../components/UserProfileForm.vue";
import { ref, onMounted } from "vue";
import Button from "../../components/Button.vue";
import UserProfileData from "../components/UserProfileData.vue";
import { obtenerSeguidores, obtenerSiguiendo } from "../../services/red.js";
import Loading from "../../components/Loading.vue";
import Section from "../../components/Section.vue";
import HeaderPage from "../../components/HeaderPage.vue";

const { user } = useAuth();
const editing = ref(false);
const toggleEditing = () => (editing.value = !editing.value);
const totalSeguidores = ref(0);
const totalSiguiendo = ref(0);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;

  if (user.value) {
    try {
      const seguidores = await obtenerSeguidores(user.value.id);
      const siguiendo = await obtenerSiguiendo(user.value.id);

      totalSeguidores.value = seguidores.length;
      totalSiguiendo.value = siguiendo.length;
    } catch (error) {
      console.error("Error al obtener seguidores y siguiendo:", error);
    }
  }

  loading.value = false;
});
</script>

<template>
  <Loading :loading="loading" />
  <HeaderPage route="/home" title="Mi Perfil" />
  <Section>
    <template v-if="editing">
      <UserProfileForm />
    </template>
    <template v-else>
      <UserProfileData
        :isMyProfile="true"
        :user="user"
        :totalSeguidores="totalSeguidores"
        :totalSiguiendo="totalSiguiendo"
        :mostrarBoton="false"
        :loading="loading"
      />
    </template>

    <div class="my-3">
      <Button class="btn btn-primary w-100" @click="toggleEditing">{{
        editing ? "Dejar de Editar" : "Editar Perfil"
      }}</Button>
    </div>
  </Section>
</template>
