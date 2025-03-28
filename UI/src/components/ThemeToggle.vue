<script setup lang="ts">
import { useThemeStore } from "../app/router/stores/Theme";
import FeatherIcon from "@/components/ThemeToggle/FeatherIcon.vue";

const theme = useThemeStore();
theme.setup();
</script>

<template>
  <Transition name="fade" mode="out-in">
      <FeatherIcon 
        :key="theme.isDark ? 'sun' : 'moon'"
        :name="theme.isDark ? 'sun' : 'moon'"
        size="24"
        strokeWidth="3"
        @click="theme.toggleTheme"
      />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
