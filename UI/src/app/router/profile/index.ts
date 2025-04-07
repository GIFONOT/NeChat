export default {
  path: "/profile",
  name: "profile",
  children: [
    {
      path: "",
      name: "profile-form",
      component: () => import("@components/UserProfile/UserProfile.vue"),
      props: true
    },
  ],
};
