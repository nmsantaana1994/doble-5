<script setup>
  import Button from "../components/Button.vue";
  import Label from "../components/Label.vue";
  import Input from "../components/Input.vue";
  import { register } from "../services/auth.js";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators';

  const { fields, loading, handleSubmit } = useRegister();

  const rules = {
    nombre: { required },
    apellido: { required },
    email: { required, email },
    password: { required, minLength: minLength(8)},
    nacimiento: { required },
    genero: { required },
    nivel: { required },
    barrio: { required },
    telefono: { required },
    terminos: { required }
  };

  const v$ = useVuelidate(rules, fields);
  const formSubmitted = ref(false);

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
        formSubmitted.value = true;
        if (v$.value.$invalid) {
        return; // No se envía el formulario si hay errores de validación
      }

      loading.value = true;
      await register({
        ...fields.value,
      });
      router.push('/home');
      loading.value = false;
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
      <span v-if="formSubmitted && v$?.nombre?.$invalid" class="text-danger">Por favor, ingrese un nombre.</span>
    </div>
    <div class="mb-3">
      <Input
        type="apellido"
        name="apellido"
        id="apellido"
        placeholder="Apellido"
        v-model="fields.apellido"
      />
      <span v-if="formSubmitted && v$?.apellido?.$invalid" class="text-danger">Por favor, ingrese un apellido.</span>
    </div>
    <div class="mb-3">
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="E-mail"
        v-model="fields.email"
      />
      <span v-if="formSubmitted && v$?.email?.$invalid" class="text-danger">Campo obligatorio</span>
    </div>
    <div class="mb-3">
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="Contraseña"
        v-model="fields.password"
      />
      <span v-if="formSubmitted && v$?.password?.minLength && v$?.password?.$invalid" class="text-danger">Campo obligatorio. Debe tener un mínimo de 8 caracteres</span>
      <!-- <span v-if="formSubmitted && v$?.password?.$invalid" class="text-danger">Campo obligatorio</span> -->
    </div>
    <div class="mb-3">
      <Input
        type="date"
        name="nacimiento"
        id="nacimiento"
        placeholder="Nombre"
        v-model="fields.nacimiento"
      />
      <span v-if="formSubmitted && v$?.nacimiento?.$invalid" class="text-danger">Por favor, ingrese una fecha de nacimiento.</span>
    </div>
    <div class="mb-3">
      <select name="genero" id="genero" v-model="fields.genero">
        <option value="" disabled>Género</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
        <option value="Prefiero no decir">Prefiero no decir</option>
      </select>
      <span v-if="formSubmitted && v$?.genero?.$invalid" class="text-danger">Por favor, seleccione una opcion.</span>
    </div>
    <div class="mb-3">
      <select name="nivel" id="nivel" v-model="fields.nivel">
        <option value="" disabled>Nivel de juego</option>
        <option value="alto">Alto</option>
        <option value="medio">Medio</option>
        <option value="bajo">Bajo</option>
      </select>
      <span v-if="formSubmitted && v$?.nivel?.$invalid" class="text-danger">Por favor, seleccione un nivel.</span>
    </div>
    <div class="mb-3">
      <select name="barrio" id="barrio" v-model="fields.barrio">
        <option value="" disabled>Barrio</option>
        <option value="Barrio 1">Barrio 1</option>
        <option value="Barrio 2">Barrio 2</option>
        <option value="Barrio 3">Barrio 3</option>
      </select>
      <span v-if="formSubmitted && v$?.barrio?.$invalid" class="text-danger">Por favor, seleccione un barrio.</span>
    </div>
    <div class="mb-3">
      <Input
        type="text"
        name="telefono"
        id="telefono"
        placeholder="Telefono: +54 9 11-2233-4455"
        v-model="fields.telefono"
      />
      <span v-if="formSubmitted && v$?.telefono?.$invalid" class="text-danger">Campo obligatorio</span>
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
      <div class="col-10">
        <span v-if="formSubmitted && v$?.terminos?.$invalid" class="text-danger">Por favor, acepte los terminos y condiciones para continuar.</span>
      </div>
    </div>
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