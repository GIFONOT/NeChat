export default {
  path: "/auth",
  name: "auth",
  children: [
    {
      path: "/register",
      name: "register",
      component: () => import("@components/RegisterForm/RegisterForm.vue"),
      props: true
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@components/LoginForm/LoginForm.vue"),
      props: true
    }
  ],
};
