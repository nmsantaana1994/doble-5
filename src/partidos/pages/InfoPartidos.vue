<script setup>
import { useRoute } from "vue-router";
import { usePartido } from "../../composition/usePartidos";
import LoadingContext from '../../components/LoadingContext.vue';
import Image from "../../components/Image.vue";
// import { getAuth } from "firebase/auth";
import { ref, onMounted, onUnmounted } from "vue";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getPartidoById, inscribirPartido } from "../services/partidos";
import { useAuth } from "../../composition/useAuth";
import alertervice from '../../utils/alert.service'

// const auth = getAuth();
const { user } = useAuth();
const db = getFirestore();
const route = useRoute();
const { loading } = usePartido(route.params.id);
const partidoFiltrado = ref(null);
const flagInscription = ref(false);

const partidoDocRef = doc(db, "partidos", route.params.id);

onMounted(async () => {
  try {
    console.log('user',user.value)
    const partido = await getPartidoById(route.params.id);
    partidoFiltrado.value = partido;
    console.log(partidoFiltrado.value)
    // Escuchar cambios en el documento del partido
    flagInscription.value = estaInscripto()
    listenToChanges();
  } catch (error) {
    console.error(error.message);
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
    if (partidoFiltrado.value) {
      await inscribirPartido(route.params.id, user);
    alertervice.show('success','Usuario inscripto correctamente')
    flagInscription.value = estaInscripto()

    }
  } catch (error) {
    alertervice.show('error',error)
    console.error("Error al inscribirse al partido:", error);
  }
}

function estaInscripto() {
  // Verifica si partidoFiltrado y contadorInscriptos están definidos
  if (!partidoFiltrado.value || !partidoFiltrado.value.contadorInscriptos) {
    return false;
  }

  // Verifica si user.id está en el array contadorInscriptos
  return partidoFiltrado.value.contadorInscriptos.some(usuario => usuario.id === user.id);
}

</script>

<template>
  <LoadingContext :loading="loading">
    <section class="row p-1 m-0">
      <div class="col-12 fotoCancha mb-3">
        <!-- IMAGEN DE MAPA -->
        <img src="../../assets/img/cancha.jpg">
      </div>
        <div class="row infoPartido">
          <div class="col-6">
          {{partidoFiltrado ? partidoFiltrado.complejo.nombre: '-'}}
        </div>
        <div class="col-3">
          {{partidoFiltrado ? partidoFiltrado.tipo: '-'}}
        </div>
        <div class="col-3">
          {{partidoFiltrado ? partidoFiltrado.cantidadJ + ' vs ' + partidoFiltrado.cantidadJ: '-'}}
        </div>
      </div>

      <div class="row mx-auto mt-2 infoPartido">
        <div class="col-12">
        <p> <span class="fw-bold">Direccion:</span> {{ partidoFiltrado ? partidoFiltrado.complejo.nombre : "-" }}</p>
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
            <p>{{ nombreJugador.nombre }}
              <router-link :to="`/usuario/${nombreJugador.uid}`">
                ver perfil
              </router-link>
            </p>
          </div>
        </div>
        <!-- <div v-if="partidoFiltrado.contadorInscriptos.value.length <= 0">
          <p>no hay jugadores inscriptos</p>
        </div> -->

      <div class="row sumarPartidoButton" v-show="!flagInscription">
          <div class="col-12">
            <button @click="inscribirseAlPartido">Unirme al partido</button>
          </div>
      </div>
  </section>
  </LoadingContext>
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
.sumarPartidoButton{
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0 0 57px 0;
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
  /* height: 200px; */
  background-color: red;
  /* opacity: .2; */
  margin: 0;
  padding: 0;
}
.fotoCancha img{
  width: 100%;
}
</style>
