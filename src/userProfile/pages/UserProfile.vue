<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUser } from "../../composition/useUser.js";
import { useAuth } from "../../composition/useAuth.js";
import {
  seguirUsuario,
  dejarDeSeguirUsuario,
  obtenerSeguidores,
  obtenerSiguiendo,
} from "../../services/red.js";
import UserProfileData from "../components/UserProfileData.vue";
import Loading from "../../components/Loading.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
import Button from "../../components/Button.vue";
import UserProfileForm from "../components/UserProfileForm.vue";

const route = useRoute();
const { user, loading } = useUser(route.params.id);
const { user: userAuth } = useAuth();
const totalSeguidores = ref(0);
const totalSiguiendo = ref(0);
const userFollowing = ref(false);
const isMyProfile = ref(false);

const editing = ref(false);
const toggleEditing = async () => {
  editing.value = !editing.value;
  if (!editing.value) {
    await fetchUserData();
  }
};

const fetchUserData = async () => {
  try {
    if (user.value.id === userAuth.value.id) {
      isMyProfile.value = true;
    } else {
      isMyProfile.value = false;
    }
    const seguidores = await obtenerSeguidores(user.value.id);
    const siguiendo = await obtenerSiguiendo(user.value.id);

    totalSeguidores.value = seguidores.length;
    totalSiguiendo.value = siguiendo.length;

    // Verificar si el usuario actual está siguiendo al usuario cuyo perfil se visualiza
    userFollowing.value = seguidores.some(
      (usuario) => usuario.id === userAuth.value.id
    );
  } catch (error) {
    console.error("Error al obtener seguidores y siguiendo:", error);
  }
};

onMounted(async () => {
  if (user.value.id && userAuth.value) {
    await fetchUserData();
  }
});

watch(
  [user, userAuth],
  async () => {
    if (user.value.id && userAuth.value) {
      await fetchUserData();
    }
  },
  { immediate: true, flush: "post" }
);

watch(editing, async () => {}, { flush: "post" });

watch(
  userFollowing,
  async () => {
    if (user.value.id && userAuth.value) {
      await fetchUserData();
    }
  },
  { flush: "post" }
);

const seguirDejarSeguir = async () => {
  try {
    if (userFollowing.value) {
      // Dejar de seguir
      await dejarDeSeguirUsuario(userAuth.value.id, user.value.id);
      userFollowing.value = false;
    } else {
      // Seguir
      await seguirUsuario(userAuth.value.id, user.value.id);
      userFollowing.value = true;
    }
    await fetchUserData(); // Asegurarse de que los datos se actualizan después de seguir/dejar de seguir
  } catch (error) {
    console.error("Error al seguir/dejar de seguir usuario:", error);
  }
};
</script>

<template>
  <HeaderPage
    route="/home"
    :title="user ? user?.displayName || user?.nombre : 'perfil'"
    v-if="!loading"
  ></HeaderPage>
  <Loading :loading="loading" />
  <template v-if="editing">
    <Section>
      <UserProfileForm @profile-updated="fetchUserData" />
      <div class="my-3" v-if="isMyProfile">
        <Button class="btn btn-primary w-100" @click="toggleEditing">{{
          editing ? "Dejar de Editar" : "Editar mi Perfil"
        }}</Button>
      </div>
    </Section>
  </template>
  <template v-else>
    <Section>
      <div class="col-12">
        <UserProfileData
          :user="user"
          :totalSeguidores="totalSeguidores"
          :totalSiguiendo="totalSiguiendo"
          :seguirDejarSeguir="seguirDejarSeguir"
          :userFollowing="userFollowing"
          :isMyProfile="isMyProfile"
        />
      </div>

      <div class="my-3" v-if="isMyProfile">
        <Button class="btn btn-primary w-100" @click="toggleEditing">{{
          editing ? "Dejar de Editar" : "Editar mi Perfil"
        }}</Button>
      </div>
    </Section>
  </template>
</template>

<style scoped>
.m-bottom {
  margin-bottom: 5em;
}
.m-bottom-valoration {
  margin-bottom: 2em;
}
</style>
