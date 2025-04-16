import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import server from "./server/index";
import { useAuthStore } from "@stores/AuthStore";
import auth from "./auth/index";
import direct from "./direct/index";

export const routes: RouteRecordRaw[] = [
  server,
  auth,
  direct,
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальная проверка перед каждым роутом
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (
    !authStore.token &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register"
  ) {
    next("/auth/login");
  } else {
    next();
  }
});

export default router;
