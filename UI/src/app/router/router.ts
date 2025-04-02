import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router' 
import home from "./home/index"
import { useAuthStore } from "@stores/AuthStore";
 
export const routes: RouteRecordRaw[] = [
  home,
  {
    path: "/auth/login",
    name: "login",
    component: () => import("@components/LoginForm/LoginForm.vue"),
  },
  {
    path: "/auth/register",
    name: "register",
    component: () => import("@components/RegisterForm/RegisterForm.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальная проверка перед каждым роутом
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.token && to.path !== "/auth/login" && to.path !== "/auth/register") {
    next("/auth/login"); // Перенаправление на логин, если нет токена
  } else {
    next();
  }
});

export default router;