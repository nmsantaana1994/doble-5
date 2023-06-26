<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    //import { cargarChatsPrivados } from '../services/private-chats.js'; // Importa la función para cargar los chats desde Firebase que falta desarrollar
    import { useAuth } from "../composition/useAuth.js"

    const chats = ref([]);
    const router = useRouter();
    const {user} = useAuth();

  // onMounted(async () => {
  //     // Carga los chats privados del usuario autenticado al montar el componente
  //     chats.value = await cargarChatsPrivados(user.value.id);
  // });

  const accederChat = (chatId) => {
      // Navega al componente PrivateChat.vue pasando el chatId como parámetro
      router.push(`/private-chat/${chatId}`);
  };
</script>

<template>
    <div>
        <h2>Lista de Chats Privados</h2>
        <ul>
            <li v-for="chat in chats" :key="chat.id" @click="accederChat(chat.id)">
                {{ chat.nombre }}
            </li>
        </ul>
    </div>
</template>
  