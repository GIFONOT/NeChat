<template>
  <button @click="logout" class="logout-button">Выйти</button>
</template>

<script setup lang="ts">
import { useAuthStore } from "@stores/AuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout(); // Вызываем метод выхода
  router.push("/auth/login"); // Перенаправляем на страницу входа
};
</script>

<style scoped>
.logout-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 1001;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>