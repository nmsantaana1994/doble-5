<script setup>
    import Image from "./Image.vue";

    defineProps({
        user: {
            type: Object,
            required: true,
        },
        totalSeguidores: {
            type: Number,
            default: 0,
        },
        totalSiguiendo: {
            type: Number,
            default: 0,
        },
        seguirDejarSeguir: {
            type: Function,
            //required: true,
        },
        userFollowing: {
            type: Boolean,
            //required: true,
        },
        mostrarBoton: {
            type: Boolean,
            default: true,
        },
    })
</script>

<template>
    <div class="row">
        <div class="col-12 mb-3">
            <div class="d-flex justify-content-center mb-3">
                <Image :src="user.photoURL" class="rounded-circle foto-perfil" />
            </div>
            <p class="h2 text-center m-0">{{ user.nombre }} {{ user.apellido }}</p>
        </div>
        <div class="col-12 mb-3">
            <div class="row">
                <div class="col-6 mt-3">
                    <p class="text-center fw-bold">{{ totalSeguidores }}</p>
                    <p class="text-center fw-bold">Seguidores</p>
                </div>
                <div class="col-6 mt-3">
                    <p class="text-center fw-bold">{{ totalSiguiendo }}</p>
                    <p class="text-center fw-bold">Siguiendo</p>
                </div>
            </div>
            <!-- Mostrar botón de seguir/dejar de seguir -->
            <div class="d-grid gap-2">
                <!-- Botón para seguir o dejar de seguir -->
                <button v-if="mostrarBoton" @click="seguirDejarSeguir" class="btn btn-primary w-auto">
                    {{ userFollowing ? 'Dejar de seguir' : 'Seguir' }}
                </button>
                
            </div>
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
    </div>
</template>

<style scoped>
    .foto-perfil {
        width: 70%;
    }
</style>