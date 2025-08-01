<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Section from "../../components/Section.vue";
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
    comentario: "",
    barrio: "",
    telefono: "",
    terminos: null,
  });

  const loading = ref(false);

  async function handleSubmit() {
    formSubmitted.value = true;
    v$.value.$touch();
    if (v$.value.$invalid) {
      return;
    }

    loading.value = true;
    await register({
      ...fields.value,
    });
    router.push("/home");
    loading.value = false;
  }

  return {
    fields,
    loading,
    handleSubmit,
  };
}

const { fields, loading, handleSubmit } = useRegister();
const soloNumeros = (value) => /^\d+$/.test(value);
const mustBeTrue = (value) => value === true;

const rules = {
  nombre: { required },
  apellido: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  nacimiento: { required },
  genero: { required },
  barrio: { required },
  telefono: { required, soloNumeros },
  terminos: { mustBeTrue },
};

const v$ = useVuelidate(rules, fields);
const formSubmitted = ref(false);
</script>

<template>
  <HeaderPage route="/iniciar-sesion" title="Registrarme"></HeaderPage>
  <Section>
    <section class="col-12">
      <p class="h6 fw-bold ms-3 mt-3">TUS DATOS</p>
      <p class="border m-line w-15"></p>
    </section>
    <form @submit.prevent="handleSubmit">
      <div class="">
        <label for="nombre">Nombre:</label>
        <Input
          :class="v$.nombre.$error ? 'inputError' : ''"
          type="text"
          name="nombre"
          id="nombre"
          placeholder="Nombre"
          v-model="fields.nombre"
          @blur="v$.nombre.$touch()"
        />
        <span v-if="v$.nombre.$error" class="text-danger"
          >Por favor, ingrese un nombre.</span
        >
      </div>
      <div class="">
        <label for="apellido">Apellido:</label>
        <Input
          :class="v$.apellido.$error ? 'inputError' : ''"
          type="text"
          name="apellido"
          id="apellido"
          placeholder="Apellido"
          v-model="fields.apellido"
          @blur="v$.apellido.$touch()"
        />
        <span v-if="v$.apellido.$error" class="text-danger"
          >Por favor, ingrese un apellido.</span
        >
      </div>
      <div class="">
        <label for="email">Email:</label>
        <Input
          :class="v$.email.$error ? '' : ''"
          type="email"
          name="email"
          id="email"
          placeholder="E-mail"
          v-model="fields.email"
          @blur="v$.email.$touch()"
        />
        <span v-if="v$.email.$error" class="text-danger"
          >Por favor, ingrese un correo electrónico válido.</span
        >
      </div>
      <div class="">
        <label for="password">Contraseña:</label>
        <Input
          :class="v$.password.$error ? '' : ''"
          type="password"
          name="password"
          id="password"
          placeholder="Contraseña"
          v-model="fields.password"
          @blur="v$.password.$touch()"
        />
        <span v-if="v$.password.$error" class="text-danger"
          >La contraseña es obligatoria y debe tener al menos 8
          caracteres.</span
        >
      </div>
      <div class="">
        <label for="nacimiento">Fecha de nacimiento:</label>
        <Input
          :class="v$.nacimiento.$error ? '' : ''"
          type="date"
          name="nacimiento"
          id="nacimiento"
          placeholder="Nacimiento"
          v-model="fields.nacimiento"
          @blur="v$.nacimiento.$touch()"
        />
        <span v-if="v$.nacimiento.$error" class="text-danger"
          >Por favor, ingrese una fecha de nacimiento.</span
        >
      </div>
      <div class="">
        <label for="genero">Genero:</label>
        <select
          name="genero"
          id="genero"
          v-model="fields.genero"
          @blur="v$.genero.$touch()"
          :class="v$.genero.$error ? '' : ''"
        >
          <option value="" disabled>Género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
        <span v-if="v$.genero.$error" class="text-danger"
          >Por favor, seleccione una opción.</span
        >
      </div>
      <div class="">
        <label for="barrio">Barrio:</label>
        <select
          name="barrio"
          id="barrio"
          v-model="fields.barrio"
          @blur="v$.barrio.$touch()"
          :class="v$.barrio.$error ? '' : ''"
        >
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
        <span v-if="v$.barrio.$error" class="text-danger"
          >Por favor, seleccione un barrio.</span
        >
      </div>
      <div class="">
        <label for="telefono">Telefono:</label>
        <Input
          :class="v$.telefono.$error ? '' : ''"
          type="number"
          name="telefono"
          id="telefono"
          placeholder="Teléfono"
          v-model="fields.telefono"
          @blur="v$.telefono.$touch()"
        />
        <span v-if="v$.telefono.$error" class="text-danger"
          >Por favor, ingrese un número de teléfono.</span
        >
      </div>
      <div class="mb-3 row d-flex align-items-center">
        <div class="col-2">
          <Input
            type="checkbox"
            name="terminos"
            id="terminos"
            v-model="fields.terminos"
            @blur="v$.terminos.$touch()"
          />
        </div>
        <div class="col-10">
          <p class="m-0">
            Acepto los
            <router-link :to="'/terminos'">términos y condiciones</router-link>
            de uso.
          </p>
        </div>
        <span v-if="v$.terminos.$error" class="text-danger">
          Por favor, acepte los términos y condiciones para continuar.
        </span>
      </div>
      <Button full class="mb-3 fw-semibold text-white">REGISTRARME</Button>
    </form>
  </Section>
</template>

<style scoped>
img {
  width: 80%;
}

.w-15 {
  width: 15%;
}

.m-line {
  margin-left: 1.8rem;
  border-color: #5d880d !important;
  border-radius: 25px;
  height: 3px;
  background-color: #5d880d;
  margin-top: 0.5rem;
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
  margin: 0.5rem 0;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 0.2px solid rgb(203, 203, 203);
  border-radius: 20px;
}
label {
  font-weight: 900;
  padding: 0 0 0.3rem 0.2rem;
}

form button {
  border-radius: 18px;
  height: 150%;
  background-color: #73a812;
}

.estrellas {
  display: flex;
  gap: 5px;
}

.estrella {
  font-size: 30px;
  color: gray;
  cursor: pointer;
  transition: 0.2s;
}

.estrella.activa {
  color: gold;
}
</style>
