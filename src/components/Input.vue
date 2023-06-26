<script setup>
    defineProps(["modelValue"]);
    defineEmits(["update:modelValue"]);
</script>

<template>
    <input
        class="w-100 p-2 border border-slate-400 rounded-xl"
        :value="modelValue"
        @input="$emit ('update:modelValue', $event.target.value)"
    >
</template>