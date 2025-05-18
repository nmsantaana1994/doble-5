<script setup>
import { ref, onMounted } from "vue";
import HeaderPage from "../components/HeaderPage.vue";
import Section from "../components/Section.vue";
import Switch from "../components/Switch.vue";
import { getUserSettings, updateUserSettings } from "../services/ajustes.js";
import { useAuth } from "../composition/useAuth.js";

const { user } = useAuth();

// Usa las mismas claves que guardás en Firestore: seguir, like, comentario, chat
const settings = ref({
  seguir: true,
  like: true,
  comentario: true,
  chat: true,
});

onMounted(async () => {
  if (user.value) {
    const currentSettings = await getUserSettings(user.value.id);
    if (currentSettings) settings.value = currentSettings;
  }
});

function toggleSetting(type) {
  settings.value[type] = !settings.value[type];
  updateUserSettings(user.value.id, settings.value);
}
</script>

<template>
  <HeaderPage route="/home" title="Ajustes" />

  <Section>
    <div class="accordion" id="settingsAccordion">

      <!-- 1) Sección Notificaciones -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingNotifications">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseNotifications"
            aria-expanded="true"
            aria-controls="collapseNotifications"
          >
          <i class="bi bi-bell me-1"></i> Notificaciones
          </button>
        </h2>
        <div
          id="collapseNotifications"
          class="accordion-collapse collapse show"
          aria-labelledby="headingNotifications"
          data-bs-parent="#settingsAccordion"
        >
          <div class="accordion-body">
            <Switch
              label="Notificaciones por Seguidores"
              :model-value="settings.seguir"
              @update:model-value="() => toggleSetting('seguir')"
            />
            <Switch
              label="Likes en tus publicaciones"
              :model-value="settings.like"
              @update:model-value="() => toggleSetting('like')"
            />
            <Switch
              label="Comentarios en tus publicaciones"
              :model-value="settings.comentario"
              @update:model-value="() => toggleSetting('comentario')"
            />
            <Switch
              label="Mensajes privados"
              :model-value="settings.chat"
              @update:model-value="() => toggleSetting('chat')"
            />
          </div>
        </div>
      </div>

      <!-- 2) Sección Privacidad (placeholder) -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingPrivacy">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsePrivacy"
            aria-expanded="false"
            aria-controls="collapsePrivacy"
          >
          <i class="bi bi-lock me-1"></i> Privacidad
          </button>
        </h2>
        <div
          id="collapsePrivacy"
          class="accordion-collapse collapse"
          aria-labelledby="headingPrivacy"
          data-bs-parent="#settingsAccordion"
        >
          <div class="accordion-body">
            <!-- Aquí podés agregar futuros toggles de privacidad -->
            <p class="text-muted mb-0">Próximamente…</p>
          </div>
        </div>
      </div>

      <!-- Puedes copiar/pegar este fragmento para más secciones -->
    </div>
  </Section>
</template>

<style scoped>
/* Opcional: un poco de padding extra */
.accordion-body {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
