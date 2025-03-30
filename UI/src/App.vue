<template>
  <!-- Постоянные элементы (будут на всех страницах) -->
  <ThemeToggle />
  <UserBar />
  <div class="Menu">
    <MenuServer />
  </div>
  <!-- Динамический контент страниц -->
  <router-view />
</template>

<script setup lang="ts">
import UserBar from "@components/UserBar/UserBar.vue";
import MenuServer from "@components/MenuServer/MenuServer.vue";
import ThemeToggle from "@components/ThemeToggle.vue"
</script>

<style lang="scss">
.Menu{
  width: max-content;
  display: flex;
  gap: 10px;
}
</style>
