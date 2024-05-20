<template>
  <div :class="['notification', type, 'shadow-xl']">
    {{ message }}
  </div>
</template>

<script lang="ts">
import type { AlertType } from '@/interfaces/alertType.interface';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String as () => AlertType['type'],
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  z-index: 9999;
}

.warning {
  background-color: #FFA500;
  /* Naranja */
}

.error {
  background-color: #FF0000;
  /* Rojo */
}

.success {
  background-color: #008000;
  /* Verde */
}
</style>