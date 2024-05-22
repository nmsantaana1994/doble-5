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
            case "success":
                return "background-noti";

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
        style="box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1)"
    >
        <div class="d-flex justify-content-between align-items-center">
            <div class="text-white">{{ data.message }}</div>

            <button
                v-if="data.closable"
                type="button"
                class="px-3 btn text-white"
                @click="$emit('close')"
            >&times;</button>
        </div>
        
    </div>
</template>

<style scoped>
    .background-noti {
        background-color: #73a812;
    }
</style>