<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  route: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>
<template>
  <section>
    <div class="row sectionHeader">
      <div class="col-3">
        <router-link :to="props.route">
          <img src="../assets/img/flecha-izquierda-blanca.png" />
          <i class="fi fi-sr-angle-left"></i>
        </router-link>
      </div>
      <div class="col-9">
        <h1>{{ props.title }}</h1>
      </div>
    </div>
  </section>
</template>
<style scoped>
section {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 4;
  background-color: var(--primary-color);
  background-image:url('../assets/img/background-partidos.png');
  background-repeat: none;
  background-size: cover;
  height: 75px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  color: white;
}

.sectionHeader {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
}

.sectionHeader div:last-child h1 {
  width: 70%;
  /* border: 1px solid green; */
  margin-left: 0;
  text-align: center;
}

img {
  width: 60px;
  height: 60px;
}

.title {
  display: flex;
  align-items: center;
  margin: auto;
}

h1 {
  margin: auto;
  text-align: right;
  font-size: 1.5rem;
}
</style>