<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import HeaderPage from '../../components/HeaderPage.vue';
import Section from '../../components/Section.vue';
import { register } from "../../services/auth.js";

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
    v$.value.$touch(); // Ensure all fields are touched to trigger validation
    if (v$.value.$invalid) {
      return;
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
  };
}

const { fields, loading, handleSubmit } = useRegister();

const rules = {
  nombre: { required },
  apellido: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  nacimiento: { required },
  genero: { required },
  nivel: { required },
  barrio: { required },
  telefono: { required },
  terminos: { required },
};

const v$ = useVuelidate(rules, fields);
const formSubmitted = ref(false);
</script>

<template>
  <HeaderPage route="/iniciar-sesion" title="Registrarme"></HeaderPage>
  <Section>
    <section class="row">
      <h2 class="ms-3">Tus Datos</h2>
    </section>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="nombre">Nombre:</label>
        <Input :class="v$.nombre.$error ? 'inputError' : ''" type="text" name="nombre" id="nombre" placeholder="Nombre"
          v-model="fields.nombre" @blur="v$.nombre.$touch()" />
        <span v-if="v$.nombre.$error" class="text-danger">Por favor, ingrese un nombre.</span>
      </div>
      <div class="mb-3">
        <label for="apellido">Apellido:</label>
        <Input :class="v$.apellido.$error ? 'inputError' : ''" type="text" name="apellido" id="apellido"
          placeholder="Apellido" v-model="fields.apellido" @blur="v$.apellido.$touch()" />
        <span v-if="v$.apellido.$error" class="text-danger">Por favor, ingrese un apellido.</span>
      </div>
      <div class="mb-3">
        <label for="email">Email:</label>
        <Input :class="v$.email.$error ? '' : ''" type="email" name="email" id="email" placeholder="E-mail"
          v-model="fields.email" @blur="v$.email.$touch()" />
        <span v-if="v$.email.$error" class="text-danger">Por favor, ingrese un correo electrónico válido.</span>
      </div>
      <div class="mb-3">
        <label for="password">Contraseña:</label>
        <Input :class="v$.password.$error ? '' : ''" type="password" name="password" id="password"
          placeholder="Contraseña" v-model="fields.password" @blur="v$.password.$touch()" />
        <span v-if="v$.password.$error" class="text-danger">La contraseña es obligatoria y debe tener al menos 8
          caracteres.</span>
      </div>
      <div class="mb-3">
        <label for="nacimiento">Fecha de nacimiento:</label>
        <Input :class="v$.nacimiento.$error ? '' : ''" type="date" name="nacimiento" id="nacimiento"
          placeholder="Nacimiento" v-model="fields.nacimiento" @blur="v$.nacimiento.$touch()" />
        <span v-if="v$.nacimiento.$error" class="text-danger">Por favor, ingrese una fecha de nacimiento.</span>
      </div>
      <div class="mb-3">
        <label for="genero">Genero:</label>
        <select name="genero" id="genero" v-model="fields.genero" @blur="v$.genero.$touch()"
          :class="v$.genero.$error ? '' : ''">
          <option value="" disabled>Género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
        <span v-if="v$.genero.$error" class="text-danger">Por favor, seleccione una opción.</span>
      </div>
      <div class="mb-3">
        <label for="nivel">Nivel:</label>
        <select name="nivel" id="nivel" v-model="fields.nivel" @blur="v$.nivel.$touch()"
          :class="v$.nivel.$error ? '' : ''">
          <option value="" disabled>Nivel de juego</option>
          <option value="Alto">Alto</option>
          <option value="Medio">Medio</option>
          <option value="Bajo">Bajo</option>
        </select>
        <span v-if="v$.nivel.$error" class="text-danger">Por favor, seleccione un nivel.</span>
      </div>
      <div class="mb-3">
        <label for="barrio">Barrio:</label>
        <select name="barrio" id="barrio" v-model="fields.barrio" @blur="v$.barrio.$touch()"
          :class="v$.barrio.$error ? '' : ''">
          <option value="" disabled>Barrio</option>
          <option value="Agronomia">Agronomia</option>
          <option value="Almagro">Almagro</option>
          <option value="Balvanera">Balvanera</option>
          <option value="Barracas">Barracas</option>
          <option value="Belgrano">Belgrano</option>
          <option value="Boedo">Boedo</option>
          <option value="Caballito">Caballito</option>
          <option value="Chacarita">Chacarita</option>
          <option value="Coghlan">Coghlan</option>
          <option value="Colegiales">Colegiales</option>
          <option value="Constitución">Constitución</option>
          <option value="Flores">Flores</option>
          <option value="Floresta">Floresta</option>
          <option value="La Boca">La Boca</option>
          <option value="La Paternal">La Paternal</option>
          <option value="Liniers">Liniers</option>
          <option value="Mataderos">Mataderos</option>
          <option value="Monte Castro">Monte Castro</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Nueva Pompeya">Nueva Pompeya</option>
          <option value="Nuñez">Nuñez</option>
          <option value="Palermo">Palermo</option>
          <option value="Parque Avellaneda">Parque Avellaneda</option>
          <option value="Parque Chacabuco">Parque Chacabuco</option>
          <option value="Parque Chas">Parque Chas</option>
          <option value="Parque Patricios">Parque Patricios</option>
          <option value="Puerto Madero">Puerto Madero</option>
          <option value="Recoleta">Recoleta</option>
          <option value="Retiro">Retiro</option>
          <option value="Saavedra">Saavedra</option>
          <option value="San Cristóbal">San Cristóbal</option>
          <option value="San Nicolás">San Nicolás</option>
          <option value="San Telmo">San Telmo</option>
          <option value="Versalles">Versalles</option>
          <option value="Villa Crespo">Villa Crespo</option>
          <option value="Villa Devoto">Villa Devoto</option>
          <option value="Villa General Mitre">Villa General Mitre</option>
          <option value="Villa Lugano">Villa Lugano</option>
          <option value="Villa Luro">Villa Luro</option>
          <option value="Villa Ortúzar">Villa Ortúzar</option>
          <option value="Villa Pueyrredón">Villa Pueyrredón</option>
          <option value="Villa Real">Villa Real</option>
          <option value="Villa Riachuelo">Villa Riachuelo</option>
          <option value="Villa Santa Rita">Villa Santa Rita</option>
          <option value="Villa Soldati">Villa Soldati</option>
          <option value="Villa Urquiza">Villa Urquiza</option>
          <option value="Vélez Sarsfield">Velez Sarsfield</option>
        </select>
        <span v-if="v$.barrio.$error" class="text-danger">Por favor, seleccione un barrio.</span>
      </div>
      <div class="mb-3">
        <label for="telefono">Telefono:</label>
        <Input :class="v$.telefono.$error ? '' : ''" type="text" name="telefono" id="telefono" placeholder="Teléfono"
          v-model="fields.telefono" @blur="v$.telefono.$touch()" />
        <span v-if="v$.telefono.$error" class="text-danger">Por favor, ingrese un número de teléfono.</span>
      </div>
      <div class="mb-3 row d-flex align-items-center">
        <div class="col-2">
          <Input type="checkbox" name="terminos" id="terminos" v-model="fields.terminos" @blur="v$.terminos.$touch()" />
        </div>
        <div class="col-10">
          <p class="m-0">Acepto los <a href="#">términos y condiciones</a> de uso.</p>
        </div>
        <span v-if="v$.terminos.$error" class="text-danger">Por favor, acepte los términos y condiciones para
          continuar.</span>
      </div>
      <Button full class="mb-3 fw-semibold text-white">REGISTRARME</Button>
    </form>
  </Section>
</template>

<style scoped>
img {
  width: 80%;
}

.inputError {
  border: 1px solid red;
  /* background-color: green; */
}

form {
  display: flex;
  flex-direction: column;
  margin-inline: 1rem;
}

form div {
  margin: 1rem 0;
}

input,
select {
  width: 100%;
  padding: .5rem;
  border: .2px solid rgb(203, 203, 203);
  border-radius: 20px;
}
label{
  font-weight: 500;
  padding: 0 0 .3rem .2rem;
}

form Button {
  border-radius: 18px;
  height: 150%;
  background-color: #73a812;
}
</style>

<!-- <script setup>
  import Button from "../../components/Button.vue";
  import Label from "../../components/Label.vue";
  import Input from "../../components/Input.vue";
  import { register } from "../../services/auth.js";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators';
  import HeaderPage from '../../components/HeaderPage.vue'
  import Section from '../../components/Section.vue'
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
        return;
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
</script> -->

<!-- <template>
  <HeaderPage route="/iniciar-sesion" title="Registrarme"></HeaderPage>
  <Section>

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
        @blur="v$.nombre.$touch()"
      />
      <span v-show="formSubmitted && v$?.nombre?.$invalid" class="text-danger">Por favor, ingrese un nombre.</span>
    </div>
    <div class="mb-3">
      <Input
        type="apellido"
        name="apellido"
        id="apellido"
        placeholder="Apellido"
        v-model="fields.apellido"
        @blur="v$.nombre.$touch()"
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
        <option value="Alto">Alto</option>
        <option value="Medio">Medio</option>
        <option value="Bajo">Bajo</option>
      </select>
      <span v-if="formSubmitted && v$?.nivel?.$invalid" class="text-danger">Por favor, seleccione un nivel.</span>
    </div>
    <div class="mb-3">
      <select name="barrio" id="barrio" v-model="fields.barrio">
        <option value="" disabled>Barrio</option>
        <option value="Agronomia">Agronomia</option>
        <option value="Alamgro">Alamgro</option>
        <option value="Balvanera">Balvanera</option>
        <option value="Barracas">Barracas</option>
        <option value="Belgrano">Belgrano</option>
        <option value="Boedo">Boedo</option>
        <option value="Caballito">Caballito</option>
        <option value="Chacarita">Chacarita</option>
        <option value="Coghlan">Coghlan</option>
        <option value="Colegiales">Colegiales</option>
        <option value="Constitución">Constitución</option>
        <option value="Flores">Flores</option>
        <option value="Floresta">Floresta</option>
        <option value="La Boca">La Boca</option>
        <option value="La Paternal">La Paternal</option>
        <option value="Liniers">Liniers</option>
        <option value="Mataderos">Mataderos</option>
        <option value="Monte Castro">Monte Castro</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Nueva Pompeya">Nueva Pompeya</option>
        <option value="Nuñez">Nuñez</option>
        <option value="Palermo">Palermo</option>
        <option value="Parque Avellaneda">Parque Avellaneda</option>
        <option value="Parque Chacabuco">Parque Chacabuco</option>
        <option value="Parque Chas">Parque Chas</option>
        <option value="Parque Patricios">Parque Patricios</option>
        <option value="Puerto Madero">Puerto Madero</option>
        <option value="Recoleta">Recoleta</option>
        <option value="Retiro">Retiro</option>
        <option value="Saavedra">Saavedra</option>
        <option value="San Cristóbal">San Cristóbal</option>
        <option value="San Nicolás">San Nicolás</option>
        <option value="San Telmo">San Telmo</option>
        <option value="Versalles">Versalles</option>
        <option value="Villa Crespo">Villa Crespo</option>
        <option value="Villa Devoto">Villa Devoto</option>
        <option value="Villa General Mitre">Villa General Mitre</option>
        <option value="Villa Lugano">Villa Lugano</option>
        <option value="Villa Luro">Villa Luro</option>
        <option value="Villa Ortúzar">Villa Ortúzar</option>
        <option value="Villa Pueyrredón">Villa Pueyrredón</option>
        <option value="Villa Real">Villa Real</option>
        <option value="Villa Riachuelo">Villa Riachuelo</option>
        <option value="Villa Santa Rita">Villa Santa Rita</option>
        <option value="Villa Soldati">Villa Soldati</option>
        <option value="Villa Urquiza">Villa Urquiza</option>
        <option value="Vélez Sarsfield">Velez Sarsfield</option>
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
      
</Section>
</template> -->


<!-- <style scoped>
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
</style> -->