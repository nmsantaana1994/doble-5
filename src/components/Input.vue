<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);

// Tipo de input dinámico (para cambiar entre text y password)
const inputType = computed(() =>
  props.type === "password"
    ? showPassword.value
      ? "text"
      : "password"
    : props.type
);

function togglePassword() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="input-wrapper">
    <input
      :type="inputType"
      :placeholder="placeholder"
      class="w-100 p-2 border border-slate-400 rounded-xl"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- Ícono solo si es password -->
    <span
      v-if="props.type === 'password'"
      class="toggle-icon"
      @click="togglePassword"
    >
      <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
    </span>
  </div>
</template>

<style scoped>
.input-wrapper {
  position: relative;
}

input {
  border-radius: 20px;
  width: 100%;
  padding-right: 2.5rem; /* espacio para el ícono */
}

.toggle-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
}
</style>
