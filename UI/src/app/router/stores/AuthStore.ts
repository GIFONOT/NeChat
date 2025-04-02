import { defineStore } from "pinia";
import apiClient from "@/api";

interface User {
  id: number;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as User | null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await apiClient.post("/auth/login", { email, password });

        if (!response.data.access_token) {
          throw new Error("Ответ сервера не содержит токен!");
        }

        this.token = response.data.access_token;
        this.user = { id: response.data.user_id, email };
        localStorage.setItem("token", this.token);
        console.log("Успешный вход:", this.user);
      } catch (error) {
        console.error("Ошибка входа:", error);
      }
    },

    async register(email: string, password: string, username: string, first_name: string, birth_date: Date) {
      try {
        await apiClient.post("/auth/register", { email, password, username, first_name, birth_date});
        console.log("Пользователь зарегистрирован, теперь можно входить");
      } catch (error) {
        console.error("Ошибка регистрации:", error);
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;

      try {
        const response = await apiClient.get("/auth/me", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data;
        console.log("Профиль загружен:", this.user);
      } catch (error) {
        console.error("Ошибка получения профиля:", error);
        this.logout();
      }
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      console.log("Вышел из системы");
    },
  },
});