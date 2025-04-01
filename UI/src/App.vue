<template>
  <!-- Постоянные элементы (будут на всех страницах) -->
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
</template>

<script setup lang="ts">
import UserBar from "@components/UserBar/UserBar.vue";
import MenuServer from "@components/MenuServer/MenuServer.vue";
import ThemeToggle from "@components/ThemeToggle.vue";
import Search from "@components/Search.vue";
import MenuFriend from "@components/MenuFriend/MenuFriend.vue";
</script>

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
