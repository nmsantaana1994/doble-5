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
        
        <div class="col-3">
            <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
        </div>
        <div class="col-9">
            <dl>
                <dt class="font-bold">Nombre de Usuario</dt>
                <dd class="mb-3">{{ user.displayName || "No especificado" }}</dd>
                <dt class="font-bold">Carrera</dt>
                <dd class="mb-3">{{ user.career || "No especificado" }}</dd>
            </dl>
        </div>

    </section>
</template>

<style>
    .foto-perfil {
        width: 100%;
    }
</style>