<template>
  <div class="auth">
    <div class="auth__container">
      <h2 class="auth__title">Регистрация</h2>
      <form class="auth__form" @submit.prevent="register">
        <input
          class="auth__input"
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          class="auth__input"
          v-model="password"
          type="password"
          placeholder="Пароль"
          required
        />
        <input
          class="auth__input"
          v-model="username"
          type="text"
          placeholder="Логин пользователя"
          required
        />
        <input
          class="auth__input"
          v-model="first_name"
          type="text"
          placeholder="Имя пользователя"
          required
        />
        <input
          class="auth__input"
          v-model="birth_date"
          type="date"
          placeholder="Дата рождения"
          required
        />
        <button class="auth__submit" type="submit">
          Зарегистрироваться
          <FeatherIcon name="user-plus" size="20" strokeWidth="2.5" />
        </button>
      </form>

      <p v-if="errorMessage" class="auth__error">{{ errorMessage }}</p>

      <p class="auth__switch">
        Есть аккаунт?
        <button class="auth__switch-btn" @click="goToLogin">Войти</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@stores/AuthStore";
import { useRouter } from "vue-router";
import FeatherIcon from "@components/Icon/FeatherIcon.vue";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const username = ref("");
const first_name = ref("");
const birth_date = ref();
const errorMessage = ref("");

const register = async () => {
  try {
    await authStore.register(
      email.value,
      password.value,
      username.value,
      first_name.value,
      birth_date.value
    );
    router.push("/login");
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      "Ошибка регистрации. Проверьте правильность заполненных полей и попробуйте снова.";
  }
};

const goToLogin = () => {
  router.push("/auth/login");
};
</script>

<style lang="scss" scoped>
.auth {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    background-color: var(--element-bg);
    padding: 24px;
    border-radius: 12px;
    width: 100%;
    max-width: 340px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &__title {
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__input {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: none;
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--accent);
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    width: max-content;
    margin: 0 auto;
    background: none;
    color: var(--text-primary);
    border: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: var(--text-secondary);
    }
  }

  &__error {
    margin: 16px 0 0;
    color: var(--error);
    font-size: 14px;
    text-align: center;
  }

  &__switch {
    margin: 20px 0 0;
    font-size: 14px;
    color: var(--text-secondary);
    text-align: center;
  }

  &__switch-btn {
    display: inline;
    padding: 0;
    background: none;
    border: none;
    color: var(--accent);
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
