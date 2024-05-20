<script setup>
    import Button from "../../components/Button.vue";
    import Input from "../../components/Input.vue";
    import {login} from "../../services/auth.js";
    import {inject, ref} from "vue";
    import { useRouter } from "vue-router";
    import { notificationProvider } from "../../symbols/symbols.js";

    const {feedback, setFeedbackMessage, clearFeedbackMessage} = inject(notificationProvider);
    
    const {fields, loading, handleSubmit} = useLogin();

    function useLogin() {
        const router = useRouter();
    
        const fields = ref({
            email: "",
            password: "",
        });
    
        const loading = ref(false);
    
        async function handleSubmit() {
            loading.value = true;

            clearFeedbackMessage();

            try {
                await login({
                    ...fields.value,
                })

                loading.value = false,

                setFeedbackMessage({
                    type: "succes",
                    message: "¡Hola de nuevo! Te extrañamos.",
                });
        
                router.push('/home')
            } catch (err) {
                setFeedbackMessage({
                    type: "error",
                    message: err,
                });
            }
    
                          
        }

        return {
            fields,
            loading,
            handleSubmit,
        }
    }
</script>

<template>
    <section class="p-4">
        <h1 class="my-5 text-center">Iniciar Sesión</h1>
        
        <div class="d-flex justify-content-center mb-5">
            <img src="../../assets/img/logo-original.png" alt="Logo Doble-5" class="ancho-logo my-5"/>
        </div>
    
        <div class="row mb-5">
            <form 
                action="#"
                method="post"
                @submit.prevent="handleSubmit"
                
            >
                <div class="mb-4">
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="E-mail"
                        v-model="fields.email"
                    />
                </div>
                <div class="mb-4">
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Contraseña"
                        class="mb-4"
                        v-model="fields.password"
                    />
                </div>
                <Button class="fw-semibold text-white py-3 my-4">INICIAR SESIÓN</Button>
            </form>
        </div>
        
        <div class="row">
            <div class="col-12 text-center mb-4">
                <a href="" class="fw-semibold">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="col-12 mt-4 d-flex justify-content-center">
                <router-link to="/registro" class="mt-4"><Button class="fw-semibold text-white py-3 px-5 register-button">CREA UNA CUENTA</Button></router-link>
            </div>
        </div>
    </section>
</template>

<style scoped>
    img{
        width: 80%;
    }

    form{
        display: flex;
        flex-direction: column;
    }

    input{
        width: 100%;
        padding: .5rem;
        border: .2px solid rgb(203, 203, 203);
        border-radius: 20px;
    }

    form button{
        border-radius: 18px;
        background-color: #000000;
    }

    a{
        color: #73a812;
        text-align: center;
    }

    .register-button {
        border-radius: 18px;
        background-color: #73a812;
        width: 100%;
        display: inline-block;
    }
</style>