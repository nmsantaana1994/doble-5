<script setup>
    import { ref, computed } from "vue";

    defineEmits(["close"]);

    const props = defineProps({
        data: {
            type: Object,
            required: true,
            closable: true,
        }
    })

    const notificationClasses = computed(() => {
        switch(props.data.type) {
            case "succes":
                return "bg-success";

            case "error":
                return "bg-danger";

            default:
                return "bg-primary";
        }
    });
</script>

<template>
    <div
        v-if="data.message !== ''"
        class="p-3 m-3 rounded"
        :class="notificationClasses"
    >
        <div class="d-flex justify-content-between align-items-center">
            <div>{{ data.message }}</div>

            <button
                v-if="data.closable"
                type="button"
                class="px-3"
                @click="$emit('close')"
            >&times;</button>
        </div>
        
    </div>
</template>