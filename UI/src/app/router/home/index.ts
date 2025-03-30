export default {
  path: "/server",
  name: "server",
  // можно добавить страницу загрузки
  children: [
    {
      path: ":id",
      name: 'server-detail',
      component: () => import("@pages/Server/Server.vue"),
      props: true
    },
  ],
};
