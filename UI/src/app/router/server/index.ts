export default {
  path: "/home",
  name: "home",
  // можно добавить страницу загрузки
  children: [
    {
      path: "server/:id",
      name: 'server-detail',
      component: () => import("@pages/Server/Server.vue"),
      props: true
    },
    
  ],
};
