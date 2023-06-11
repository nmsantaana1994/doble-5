<script setup>
    defineProps({
        route: String,
        icon: String
    });
</script>

<template>
    <div class="justify-content-center m-auto">
        <router-link :to="`/${route}`">
            <img :src="`../assets/img/${icon}`" alt="" class="icono-card mt-1">
            <p>{{ route }}</p>
        </router-link>
    </div>
</template>

<style scoped>
    div {
        width: 4.5rem;
        height: 4.5rem;
        background-color: #73a812;
        border-radius: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    router-link {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    img {
        width: 100%;
    }

    .icono-card {
        width: 55%;
    }

    a {
        text-decoration: none;
        color: white;
    }

    p {
        margin: 0;
    }
</style>