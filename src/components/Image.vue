<script setup>
import { computed } from "vue";
import defaultImg from "../assets/img/no-image.png";

const props = defineProps({
  src: {
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
});

const showSrc = computed(() => (props.src !== null && props.src !== "" ? props.src : defaultImg));
</script>

<template>
  <div class="image-wrapper">
    <img
      class="foto-perfil"
      :src="showSrc"
      :alt="alt"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  width: 100%;
  padding-top: 100%; /* Aspect ratio 1:1 */
  position: relative;
}

.foto-perfil {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
