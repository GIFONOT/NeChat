<template>
  <div v-if="!authStore.token" class="auth-overlay">
    <div class="auth-container">
      <h2>Вход</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="switch-form">
        Нет аккаунта? 
        <button @click="goToRegister">Зарегистрироваться</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from '@stores/AuthStore';
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Ошибка авторизации. Неверные почта/пароль.";
  }
};

const goToRegister = () => {
  router.push("/auth/register");
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  color: black;
  opacity: 1 !important; /* Явно указываем, что текст не должен становиться прозрачным */
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.switch-form {
  margin-top: 10px;
}

.switch-form button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.switch-form button:hover {
  text-decoration: underline;
}
</style>