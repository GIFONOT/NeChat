export default {
  //Если использовать path: "/home", то перезаписывает сервер. Нужно либо в него добавлять либо так
    path: '/direct/:id',
    name: 'direct-message',
    component: () => import('@pages/Direct/Direct.vue'),
    props: true,
  };
  