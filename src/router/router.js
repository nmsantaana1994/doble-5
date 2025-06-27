import { subscribeToAuth } from "../services/auth.js";
import { createRouter, createWebHashHistory } from "vue-router";
import Splash from "../views/Splash.vue";
import Home from "../home/pages/Home.vue";
import Chat from "../chat/pages/Chat.vue";
import Login from "../login/pages/Login.vue";
import Register from "../register/pages/Register.vue";
import MyProfile from "../userProfile/pages/MyProfile.vue";
import UserProfile from "../userProfile/pages/UserProfile.vue";
import PrivateChat from "../chat/pages/PrivateChat.vue";
import CargaPartido from "../partidos/pages/CargaPartido.vue";
import MisPartidos from "../partidos/pages/MisPartidos.vue";
import ListaChatsPrivados from "../chat/pages/ListaChatsPrivados.vue";
import InfoPartidos from "../partidos/pages/InfoPartidos.vue";
import Partidos from "../partidos/pages/Partidos.vue";
import InscribirPartido from "../partidos/pages/InscribirPartido.vue";
import Feed from "../feed/pages/Feed.vue";
import Comments from "../views/Comments.vue";
import Red from "../views/Red.vue";
import Ajustes from "../ajustes/Ajustes.vue";
import Ayuda from "../views/Ayuda.vue";
import Notificaciones from "../notifications/pages/notificaciones.vue";
import AddValoration from "../userProfile/components/addValoration.vue";
import ValorationList from "../userProfile/pages/ValorationList.vue";
import Terminos from "../terminos/Terminos.vue";
import ResetUser from "../login/pages/ResetUser.vue";

const routes = [
  {
    path: "/",
    beforeEnter: (to, from, next) => {
      if (user.id) {
        next("/home");
      } else {
        next();
      }
    },
    component: Splash,
  },
  { path: "/iniciar-sesion", component: Login },
  { path: "/reset-user", component: ResetUser },
  { path: "/registro", component: Register },
  { path: "/terminos", component: Terminos },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/chat", component: Chat, meta: { requiresAuth: true } },
  { path: "/partidos", component: Partidos, meta: { requiresAuth: true } },
  {
    path: "/list-private-chats",
    component: ListaChatsPrivados,
    meta: { requiresAuth: true },
  },
  {
    path: "/notificaciones",
    component: Notificaciones,
    meta: { requiresAuth: true },
  },
  {
    path: "/perfil",
    component: () => import("../userProfile/pages/MyProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/usuario/:id",
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuario/:id/valoration",
    component: AddValoration,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuario/:id/valorationList",
    component: ValorationList,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuario/:id/chat",
    component: PrivateChat,
    meta: { requiresAuth: true },
  },
  {
    path: "/carga-partidos",
    component: CargaPartido,
    meta: { requiresAuth: true },
  },
  {
    path: "/mis-partidos",
    component: MisPartidos,
    meta: { requiresAuth: true },
  },
  {
    path: "/info-partido/:id",
    component: InfoPartidos,
    meta: { requiresAuth: true },
  },
  {
    path: "/inscription/:id",
    component: InscribirPartido,
    meta: { requiresAuth: true },
  },
  { path: "/feed", component: Feed, meta: { requiresAuth: true } },
  {
    path: "/comments/:postId",
    component: Comments,
    meta: { requiresAuth: true },
  },
  { path: "/red", component: Red, meta: { requiresAuth: true } },
  //   {
  //     path: "/notificaciones",
  //     component: Notificaciones,
  //     meta: { requiresAuth: true },
  //   },
  { path: "/ajustes", component: Ajustes, meta: { requiresAuth: true } },
  { path: "/ayuda", component: Ayuda, meta: { requiresAuth: true } },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

let user = {
  id: null,
  email: null,
};

subscribeToAuth((newUser) => (user = newUser));

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && user.id === null) {
    return {
      path: "/iniciar-sesion",
    };
  }
});

export default router;
