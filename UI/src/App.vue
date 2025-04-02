<template>
  <div v-if="!authStore.token" class="auth-overlay">
    <router-view />
  </div>
  <div v-else>
    <!-- Постоянные элементы (будут на всех страницах) -->
    <LogoutButton />
    <ThemeToggle />
    <div class="Main">
      <Search />
      <div class="Main__menu">
        <MenuServer />
        <MenuFriend />
      </div>
      <UserBar />
    </div>
    <!-- Динамический контент страниц -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@stores/AuthStore";
import UserBar from "@components/UserBar/UserBar.vue";
import MenuServer from "@components/MenuServer/MenuServer.vue";
import ThemeToggle from "@components/ThemeToggle.vue";
import Search from "@components/Search.vue";
import MenuFriend from "@components/MenuFriend/MenuFriend.vue";
import LogoutButton from "@components/LogoutButton/LogoutButton.vue";

const authStore = useAuthStore();
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>

<style lang="scss">
.Main {
  width: 300px;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__menu{
    display: flex;
  }
}
</style>
