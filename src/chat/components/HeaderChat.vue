<script setup>
import Image from "../../components/Image.vue";
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    otherUser: {
        type: Object,
        required: true,
    },
    isOnline: Boolean,
});

const router = useRouter();

function goBack() {
    router.push("/chat");
}
</script>

<template>
    <div class="row sectionHeader">
        <div class="col-3" @click="goBack">
            <img src="../../assets/img/flecha-izquierda-blanca.png" />
            <i class="fi fi-sr-angle-left"></i>
        </div>
        <div class="col-9 title_chat">
            <div class="image-container">
                <Image :src="otherUser.photoURL" />
            </div>
            <div>
                <h1>
                    <!-- <span
                        v-if="otherUser.displayName"
                        style="font-size: 1.5rem; margin-right: 0.5rem"
                        class="d-inline-block"
                        >{{ otherUser.displayName }}</span
                    > -->
                    {{
                        otherUser.displayName
                            ? otherUser.displayName
                            : otherUser.nombre
                    }}
                </h1>
                <span v-if="isOnline" style="color: white; font-size: 0.8rem">● En línea</span>
                <span v-else style="color: white; font-size: 1rem">● Desconectado</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 4;
    background-image: url("../../assets/img/background-partidos.png");
    background-repeat: none;
    background-size: cover;
    height: 75px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
    color: white;
}

.sectionHeader {
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
}

.title_chat {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.image-container {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

h1 {
    margin: auto 0;
    text-align: center;
    font-size: 1.5rem;
}

img {
    width: 60px;
    height: 60px;
}
</style>
