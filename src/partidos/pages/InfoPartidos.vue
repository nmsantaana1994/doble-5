<script setup>
import { ref, onMounted, onUnmounted, inject, watch } from "vue";
import { getPartidoById, inscribirPartido } from "../services/partidos";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { notificationProvider } from "../../symbols/symbols.js";
import { usePartido } from "../../composition/usePartidos";
import { useRoute } from "vue-router";
import { useAuth } from "../../composition/useAuth";
import Image from "../../components/Image.vue";
import HeaderPage from "../../components/HeaderPage.vue";
import Loading from '../../components/Loading.vue'

const db = getFirestore();
const { user } = useAuth();
const route = useRoute();
const { loading } = usePartido(route.params.id);
const { setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
const partidoDocRef = doc(db, "partidos", route.params.id);

const partidoFiltrado = ref(null);
const flagInscription = ref(false);


onMounted(async () => {
  try {
    const partido = await getPartidoById(route.params.id);
    partidoFiltrado.value = partido;
    console.log(partidoFiltrado.value)
    flagInscription.value = estaInscripto()
    listenToChanges();
  } catch (error) {
    console.error(error.message);
  }
});

watch(partidoFiltrado, (newVal, oldVal) => {
  if (newVal) {
    flagInscription.value = estaInscripto();
  }
});


// // Función para suscribirse a los cambios en el documento del partido
function listenToChanges() {
  const unsubscribe = onSnapshot(partidoDocRef, (snapshot) => {
    if (snapshot.exists()) {
      partidoFiltrado.value = { ...snapshot.data(), id: snapshot.id };
    } else {
      partidoFiltrado.value = null;
    }
  });
    // Detener la escucha de cambios cuando el componente se desmonte
    onUnmounted(unsubscribe);
}

async function inscribirseAlPartido() {
  try {
    clearFeedbackMessage();
    if (partidoFiltrado.value) {
      await inscribirPartido(route.params.id, user);
    flagInscription.value = estaInscripto()
    setFeedbackMessage({type:"success",message:"Usuario inscripto correctamente"})

    }
  } catch (error) {
    setFeedbackMessage({type:"error",message:error})
  }
}

function estaInscripto() {
  if (!partidoFiltrado.value || !partidoFiltrado.value.contadorInscriptos) {
    return false;
  }
  return partidoFiltrado.value.contadorInscriptos.some(usuario => usuario.uid === user.value.id);
}

</script>

<template class="main">
    <Loading :loading="loading" />
      <HeaderPage title="Informacion" route="/home"></HeaderPage>
      <section class="row p-1" style="margin: 75px 0 50px 0;">
        <div class="col-12 fotoCancha mb-3">
          <img src="../../assets/img/cancha.jpg">
        </div>
          <div class="row infoPartido">
            <div class="col-6 fw-bold nombreComplejo">
            {{partidoFiltrado ? partidoFiltrado.complejo.nombre: '-'}}
          </div>
          <div class="col-3 ">
            {{partidoFiltrado ? partidoFiltrado.tipo: '-'}}
          </div>
          <div class="col-3">
            {{partidoFiltrado ? partidoFiltrado.cantidadJ + ' vs ' + partidoFiltrado.cantidadJ: '-'}}
          </div>
        </div>

        <div class="row mx-auto mt-2 infoPartido">
          <div class="col-12">
          <p> <span class="fw-bold text-black">Direccion:</span> {{ partidoFiltrado ? partidoFiltrado.complejo.nombre : "-" }}</p>
          </div>
          <div class="col-12">
          <p><span class="fw-bold"> Dia:</span> {{ partidoFiltrado ? partidoFiltrado.fecha : "-" }}</p>
          </div>
          <div class="col-12">
          <p><span class="fw-bold"> Horario:</span> {{ partidoFiltrado ? partidoFiltrado.hora : "-" }}</p>
          </div>
        </div>
        <div class="row mx-auto mt-2 infoPartido">
          <div class="col-12">
          <p> Organizado por: <br>{{ partidoFiltrado ? partidoFiltrado.usuarioCreador : "-" }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
          <p class="text-center fs-2 fw-bold">Jugadores</p>
          </div>
        </div>
        
          <div class="row d-flex align-items-center border-bottom mb-2 pb-2 mx-auto" v-for="nombreJugador in partidoFiltrado
          ? partidoFiltrado.contadorInscriptos
          : []"
          :key="nombreJugador">
            <div class="col-3">
                  <Image :src="nombreJugador.image" class="rounded-circle foto-perfil" />
            </div>
            <div class="col-9 pt-3">
              <p> <span class="fw-bold">{{ nombreJugador.nombre }}&nbsp;&nbsp;</span>
                <router-link :to="`/usuario/${nombreJugador.uid}`">
                  ver perfil
                </router-link>
              </p>
            </div>
          </div>
        <div class="row sumarPartidoButton">
            <div class="col-12">
              <button @click="inscribirseAlPartido" v-show="!flagInscription">Unirme al partido</button>
            </div>
        </div>
      </section>
</template>

<style scoped>
ul{
  list-style: none;
}
.foto-perfil {
        width: 100%;
}
.infoPartido{
  color: grey;
}
.infoPartido span, .nombreComplejo{
    color: rgb(75, 75, 75);
  }
.sumarPartidoButton{
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0 0 54px 0;
  background-color: rgb(2, 169, 2);
}
.sumarPartidoButton button{
  width: 100%;
  border: none;
  background-color: transparent;
  color: white;
  font-weight: 500;
  padding: .5rem;
}
.fotoCancha{
  width: 100%;
  background-color: red;
  margin: 0;
  padding: 0;
}
.fotoCancha img{
  width: 100%;
}
</style>
