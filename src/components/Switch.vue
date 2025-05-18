<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue"]);

function onChange(e) {
  emit("update:modelValue", e.target.checked);
}
</script>

<template>
  <div class="form-check form-switch d-flex justify-content-between align-items-center mb-3 p-0">
    <label class="form-check-label">{{ label }}</label>
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      @change="onChange"
    />
  </div>
</template>
