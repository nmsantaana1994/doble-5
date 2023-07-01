<script setup>
    import Image from "./Image.vue";

    defineProps({
        user: {
            type: Object,
            required: true,
        }
    })
</script>

<template>
    <section class="row">
        
        <div class="col-12 mb-3 d-flex justify-content-center">
            <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
        </div>
        <div class="col-12">
            <dl>
                <dt class="font-bold">Nombre de Usuario</dt>
                <dd class="mb-3">{{ user.displayName || "No especificado" }}</dd>
                <dt class="font-bold">Nombre</dt>
                <dd class="mb-3">{{ user.nombre || "No especificado" }}</dd>
                <dt class="font-bold">Apellido</dt>
                <dd class="mb-3">{{ user.apellido || "No especificado" }}</dd>
                <!-- <dt class="font-bold">Carrera</dt>
                <dd class="mb-3">{{ user.career || "No especificado" }}</dd> -->
                <dt class="font-bold">Nivel de juego</dt>
                <dd class="mb-3">{{ user.nivel || "No especificado" }}</dd>
            </dl>
        </div>

    </section>
</template>

<style scoped>
    .foto-perfil {
        width: 80%;
    }
</style>