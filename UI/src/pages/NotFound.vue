<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link to="/" class="home-link">Вернуться на главную</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;

  h1 {
    font-size: 5rem;
    margin-bottom: 1rem;
    color: var(--error-color);
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .home-link {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.3s;

    &:hover {
      background: var(--primary-hover);
    }
  }
}
</style>
