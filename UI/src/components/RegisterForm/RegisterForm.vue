<template>
  <div class="auth-overlay">
    <div class="auth-container">
      <h2>Регистрация</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Пароль" required />
        <input v-model="username" type="text" placeholder="Логин пользователя" required />
        <input v-model="first_name" type="text" placeholder="Имя пользователя" required />
        <input v-model="birth_date" type="date" placeholder="Дата рождения (гггг.мм.дд)" required />
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="switch-form">
        Есть аккаунт?
        <button @click="goToLogin">Войти</button>
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
const username = ref("");
const first_name = ref("");
const birth_date = ref("");
const errorMessage = ref("");

const register = async () => {
  try {
    await authStore.register(email.value, password.value, username.value, first_name.value, birth_date.value);
    router.push("/login"); // Редирект только при успешной регистрации
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Ошибка регистрации. Проверьте правильность заполненных полей и попробуйте снова.";
  }
};

const goToLogin = () => {
  router.push("/auth/login");
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