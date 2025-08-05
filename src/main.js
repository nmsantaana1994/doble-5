import "./app.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App lista para funcionar offline");
  },
});

app.use(router);

app.mount("#app");
