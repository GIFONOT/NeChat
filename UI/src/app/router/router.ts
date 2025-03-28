import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router' 
import home from "./home/index"

export const routes: RouteRecordRaw[] = [
  home,
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
