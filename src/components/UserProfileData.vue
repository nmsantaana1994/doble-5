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
        <div class="col-12 mt-3">
            <dl class="d-flex flex-column justify-content-center ps-3">
                <dt class="fw-light">NOMBRE DE USUARIO</dt>
                <dd class="mb-3 fw-bold">{{ user.displayName || "No especificado" }}</dd>
                <dt class="fw-light">NOMBRE</dt>
                <dd class="mb-3 fw-bold">{{ user.nombre || "No especificado" }}</dd>
                <dt class="fw-light">APELLIDO</dt>
                <dd class="mb-3 fw-bold">{{ user.apellido || "No especificado" }}</dd>
                <!-- <dt class="fw-light" >Carrera</dt>
                <dd class="mb-3">{{ user.career || "No especificado" }}</dd> -->
                <dt class="fw-light" >EMAIL</dt>
                <dd class="mb-3 fw-bold">{{ user.email }}</dd>
                <dt class="fw-light" >FECHA DE NACIMIENTO</dt>
                <dd class="mb-3 fw-bold">{{ user.nacimiento }}</dd>
                <dt class="fw-light" >NIVEL DE JUEGO</dt>
                <dd class="mb-3 fw-bold">{{ user.nivel || "No especificado" }}</dd>
                <dt class="fw-light" >GÉNERO</dt>
                <dd class="mb-3 fw-bold">{{ user.genero || "No especificado" }}</dd>
                <dt class="fw-light" >BARRIO</dt>
                <dd class="mb-3 fw-bold">{{ user.barrio || "No especificado" }}</dd>
                <dt class="fw-light" >TELÉFONO</dt>
                <dd class="mb-3 fw-bold">{{ user.telefono || "No especificado" }}</dd>
            </dl>
        </div>

    </section>
</template>

<style scoped>
    .foto-perfil {
        width: 70%;
    }
</style>