import { defineStore } from "pinia";
import { useUserStore } from "@stores/UserStore";
import apiClient from "@/api";

interface User {
  id: number;
  email: string;
  username: string;
  image: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user") as string) 
      : null as User | null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await apiClient.post("/auth/login", { email, password });
        const userStore = useUserStore();

        if (!response.data.access_token) {
          throw new Error("Ответ сервера не содержит токен!");
        }

        this.token = response.data.access_token;
        this.user = { 
          id: response.data.user_id, 
          email,
          username: response.data.username,
          image: response.data.avatar_url,
        };

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        userStore.updateUsername(response.data.username);
        userStore.updateImage(response.data.avatar_url);

        console.log("Успешный вход:", this.user);
      } catch (error) {
        console.error("Ошибка входа:", error);
        throw error;
      }
    },

    async register(email: string, password: string, username: string, first_name: string, birth_date: Date) {
      try {
        await apiClient.post("/auth/register", { email, password, username, first_name, birth_date});
        console.log("Пользователь зарегистрирован, теперь можно входить");
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        throw error;
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;

      try {
        const response = await apiClient.get("/auth/me", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data;

        localStorage.setItem("user", JSON.stringify(this.user)); // Обновляем user
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
      localStorage.removeItem("user");
      console.log("Вышел из системы");
    },
  },
});