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

const routes = [
    { path: "/",                    component: Splash,},
    { path: "/iniciar-sesion",      component: Login,},
    { path: "/registro",            component: Register,},
    { path: "/home",                component: Home,        meta: { requiresAuth: true, }},
    { path: "/chat",                component: Chat,        meta: { requiresAuth: true, }},
    { path: "/perfil",              component: MyProfile,   meta: { requiresAuth: true, }},
    { path: "/usuario/:id",         component: UserProfile, meta: { requiresAuth: true, }},
    { path: "/usuario/:id/chat",    component: PrivateChat, meta: { requiresAuth: true, }},
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