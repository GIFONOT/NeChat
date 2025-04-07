import { defineStore } from "pinia";
import apiClient from "@/api";

export const useServerStore = defineStore("server", {
  state: () => ({

  }),

  actions: {
    // Загрузка серверов пользователя

    // Создание нового сервера

    // Загрузка данных конкретного сервера

    // Загрузка участников сервера

    // Обновление сервера
    // Удаление сервера

    // Сброс состояния
    clearServerStore() {
      
    },
  },
});
