<script setup lang="ts">
import { useThemeStore } from "@stores/Theme";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const theme = useThemeStore();
theme.setup();
</script>

<template>
  <div class="ToggleTheme">
    <Transition name="fade" mode="out-in">
      <FeatherIcon
        :key="theme.isDark ? 'sun' : 'moon'"
        :name="theme.isDark ? 'sun' : 'moon'"
        size="24"
        strokeWidth="3"
        class="ToggleTheme__icon"
        @click="theme.toggleTheme"
      />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.ToggleTheme {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;

  &__icon {
    cursor: pointer;
    
    &:hover {
      cursor: pointer;
      //transform: scale(1.05);
    }
  }
}

</style>
