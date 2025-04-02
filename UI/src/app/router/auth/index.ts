import type { RouteRecordRaw } from 'vue-router';

export default {
  path: "/auth",
  name: "auth",
  children: [
    {
      path: "/auth/register",
      name: "register",
      component: () => import("@components/RegisterForm/RegisterForm.vue"),
      props: true
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("@components/LoginForm/LoginForm.vue"),
      props: true
    }
  ],
} as RouteRecordRaw;
