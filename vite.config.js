//Importamos el plugin de Vue, y lo agregamos a los plugins de Vite.
import vue from "@vitejs/plugin-vue";

export default {
    plugins: [vue()],
    build: {
        chunkSizeWarningLimit: 700, // Ajusta este valor según tus necesidades
      },
}