<script setup>
    defineProps(["modelValue"]);
    defineEmits(["update:modelValue"]);
</script>

<template>
    <textarea
        class="w-full p-2 border border-slate-400 rounded-xl"
        :value="modelValue"
        @input="$emit ('update:modelValue', $event.target.value)"
    ></textarea>
</template>