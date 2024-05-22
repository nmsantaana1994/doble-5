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
          <img src="../assets/img/flecha-izquierda.png" />
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
  background-color: white;
  border-bottom: 1px solid black;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1)
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