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
  <!-- <hr> -->
</template>
<style scoped>
section {
  height: 50px;
  display: flex;
  align-items: center;
}

.sectionHeader {
  padding-top: 1rem;
  width: 98%;
  margin: auto;
  border-bottom: 1px solid black;
  margin-bottom: .2rem;
}

.sectionHeader div:last-child h1{
  text-align: center;
}
img {
  width: 50%;
}
.title{
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