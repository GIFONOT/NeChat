<template>
  <div v-if="!authStore.token" class="auth">
    <div class="auth__container">
      <h2 class="auth__title">Вход</h2>
      <form class="auth__form" @submit.prevent="login">
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
        <button class="auth__submit" type="submit">
          Войти <FeatherIcon name="log-in" size="20" strokeWidth="2.5" />
        </button>
      </form>

      <p v-if="errorMessage" class="auth__error">{{ errorMessage }}</p>

      <p class="auth__switch">
        Нет аккаунта?
        <button class="auth__switch-btn" @click="goToRegister">
          Зарегистрироваться
        </button>
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
const errorMessage = ref("");

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push({
      path: "/home",
    });
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      "Ошибка авторизации. Неверные почта/пароль.";
  }
};

const goToRegister = () => {
  router.push({
    path: "/auth/register",
  });
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
    max-width: 320px;
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
    padding: 12px;
    width: max-content;
    background: none;
    color: var(--text-primary);
    border: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin: 0 auto;

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
