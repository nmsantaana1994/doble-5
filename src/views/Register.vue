<script setup>
    import Button from "../components/Button.vue";
    import Label from "../components/Label.vue";
    import Input from "../components/Input.vue";
    import {register} from "../services/auth.js";
    import {ref} from "vue";
    import { useRouter } from "vue-router";
    
    const {fields, loading, handleSubmit} = useRegister();

    function useRegister() {
        const router = useRouter();
    
        const fields = ref({
            email: "",
            password: "",
            nombre: "",
            apellido: "",
            nacimiento: "",
            genero: "",
            nivel: "",
            barrio: "",
            telefono: "",
            terminos: false,
        });
    
        const loading = ref(false);
    
        async function handleSubmit() {
            loading.value = true;
    
            await register({
                ...fields.value,
            })
            loading.value = false;
                
            router.push('/home');               
        }

        return {
            fields,
            loading,
            handleSubmit,
        }
    }
</script>

<template>
    <section class="row">
        <div class="col-3 d-flex justify-content-center align-items-center">
            <router-link :to="`/iniciar-sesion`">
                <img src="../assets/img/flecha-izquierda.png" />
                <i class="fi fi-sr-angle-left"></i>
            </router-link>
        </div>
        <div class="col-9 d-flex align-items-center">
            <h1 class="text-center">Registrarme</h1>
        </div>
    </section>

    <section class="row">
        <h2 class="ms-3">Tus Datos</h2>
    </section>
    <form
        action="#"
        method="post"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <Input
                type="nombre"
                name="nombre"
                id="nombre"
                placeholder="Nombre"
                v-model="fields.nombre"
            />
        </div>
        <div class="mb-3">
            <Input
                type="apellido"
                name="apellido"
                id="apellido"
                placeholder="Apellido"
                v-model="fields.apellido"
            />
        </div>
        <div class="mb-3">
            <Input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                v-model="fields.email"
            />
        </div>
        <div class="mb-3">
            <Input
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                v-model="fields.password"
            />
        </div>
        <div class="mb-3">
            <Input
                type="date"
                name="nacimiento"
                id="nacimiento"
                placeholder="Nombre"
                v-model="fields.nacimiento"
            />
        </div>
        <div class="mb-3">
            <select name="genero" id="genero" v-model="fields.genero">
                <option value="" disabled>Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
        </div>
        <div class="mb-3">
            <select name="nivel" id="nivel" v-model="fields.nivel">
                <option value="" disabled>Nivel de juego</option>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
                <option value="bajo">Bajo</option>
            </select>
        </div>
        <div class="mb-3">
            <select name="barrio" id="barrio" v-model="fields.barrio">
                <option value="" disabled>Barrio</option>
                <option value="alto">Barrio 1</option>
                <option value="medio">Barrio 2</option>
                <option value="bajo">Barrio 3</option>
            </select>
        </div>
        <div class="mb-3">
            <Input
                type="text"
                name="telefono"
                id="telefono"
                placeholder="Telefono: +54 9 11-2233-4455"
                v-model="fields.telefono"
            />
        </div>
        <div class="mb-3 row d-flex align-items-center">           
            <div class="col-2">
                <Input
                    type="checkbox"
                    name="terminos"
                    id="terminos"
                    placeholder="terminos: +54 9 11-2233-4455"
                    v-model="fields.terminos"
                />
            </div>
            <div class="col-10">
                <p class="m-0">Acepto los <a href="">términos y condiciones</a> de uso.</p>
            </div>
        </div>
        <!-- <button type="submit" class="transition-colors w-full bg-blue-700 focus:bg-blue-600 hover:bg-blue-600 active:bg-blue-800 p-2 rounded-xl text-white">Crear Cuenta</button> -->
        <Button full class="mb-3 fw-semibold text-white">REGISTRARME</Button>
    </form>
</template>

<style scoped>
    img {
        width: 80%;
    }

    form{
        display: flex;
        flex-direction: column;
        margin-inline: 1rem;
    }

    form div{
        margin: 1rem 0;
    }

    input, select{
        width: 100%;
        padding: .5rem;
        border: .2px solid rgb(203, 203, 203);
        border-radius: 20px;
    }

    form button{
        border-radius: 18px;
        height: 150%;
        background-color: #73a812;
    }
</style>