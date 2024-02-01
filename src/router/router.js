import { subscribeToAuth } from "../services/auth.js";
import { createRouter, createWebHashHistory } from "vue-router";
import Splash from "../views/Splash.vue";
import Home from "../views/Home.vue";
import Chat from "../views/Chat.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyProfile from "../views/MyProfile.vue";
import UserProfile from "../views/UserProfile.vue";
import PrivateChat from "../views/PrivateChat.vue";
import CargaPartido from "../views/CargaPartido.vue";
import MisPartidos from "../views/MisPartidos.vue";
import ListaChatsPrivados from "../views/ListaChatsPrivados.vue";
import InfoPartidos from "../views/InfoPartidos.vue";
import Partidos from "../views/Partidos.vue";
import InscribirPartido from "../views/InscribirPartido.vue";
import Feed from "../views/Feed.vue";
import Comments from "../views/Comments.vue";
import Red from "../views/Red.vue";
import Notificaciones from "../views/Notificaciones.vue";
import Ajustes from "../views/Ajustes.vue";
import Ayuda from "../views/Ayuda.vue";

const routes = [
    { path: "/",                            component: Splash,},
    { path: "/iniciar-sesion",              component: Login,},
    { path: "/registro",                    component: Register,},
    { path: "/home",                        component: Home,                meta: { requiresAuth: true, }},
    { path: "/chat",                        component: Chat,                meta: { requiresAuth: true, }},
    { path: "/partidos",                    component: Partidos,            meta: { requiresAuth: true, }},
    { path: "/list-private-chats",          component: ListaChatsPrivados,  meta: { requiresAuth: true, }},
    { path: "/perfil",                      component: MyProfile,           meta: { requiresAuth: true, }},
    { path: "/usuario/:id",                 component: UserProfile,         meta: { requiresAuth: true, }},
    { path: "/usuario/:id/chat",            component: PrivateChat,         meta: { requiresAuth: true, }},
    { path: "/carga-partidos",              component: CargaPartido,        meta: { requiresAuth: true, }},
    { path: "/mis-partidos",                component: MisPartidos,         meta: { requiresAuth: true, }},
    { path: "/info-partido/:id",            component: InfoPartidos,        meta: { requiresAuth: true, }},
    { path: "/inscription/:id",             component: InscribirPartido,    meta: { requiresAuth: true, }},
    { path: "/feed",                        component: Feed,                meta: { requiresAuth: true, }},
    { path: "/comments/:postId",            component: Comments,            meta: { requiresAuth: true, }},
    { path: "/red",                         component: Red,                 meta: { requiresAuth: true, }},
    { path: "/notificaciones",              component: Notificaciones,      meta: { requiresAuth: true, }},
    { path: "/ajustes",                     component: Ajustes,             meta: { requiresAuth: true, }},
    { path: "/ayuda",                       component: Ayuda,               meta: { requiresAuth: true, }},
]

const router = createRouter ({
    routes,
    history: createWebHashHistory(),
});

let user = {
    id: null,
    email: null,
}

subscribeToAuth(newUser => user = newUser);


router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return {
            path: '/iniciar-sesion',
        }
    }
});

export default router;