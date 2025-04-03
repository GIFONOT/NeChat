export default {
  path: "/auth",
  name: "auth",
  children: [
    {
      path: "register",
      name: "register-form",
      component: () => import("@components/RegisterForm/RegisterForm.vue"),
      props: true
    },
    {
      path: "login",
      name: "login-form",
      component: () => import("@components/LoginForm/LoginForm.vue"),
      props: true
    }
  ],
};
