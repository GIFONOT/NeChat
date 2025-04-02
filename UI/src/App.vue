<template>
  <div v-if="!authStore.token" class="auth-overlay">
    <router-view />
  </div>
  <div v-else>
    <LogoutButton />
    <ThemeToggle />
    <div class="page">
      <div class="main" :class="{ 'main--collapsed': isCollapsed }">
        <FeatherIcon
          :key="isCollapsed ? 'chevron-right' : 'chevron-left'"
          :name="isCollapsed ? 'chevron-right' : 'chevron-left'"
          size="24"
          class="collapse-btn"
          @click="toggleCollapse"
        />
        <Search v-if="!isCollapsed" />
        <div class="content-wrapper">
          <div class="main__menu" v-if="!isCollapsed">
            <MenuServer />
            <MenuFriend />
          </div>
          <UserBar class="user-bar" :compact="isCollapsed" />
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserBar from "@components/UserBar/UserBar.vue";
import MenuServer from "@components/MenuServer/MenuServer.vue";
import ThemeToggle from "@components/ThemeToggle.vue";
import Search from "@components/Search.vue";
import MenuFriend from "@components/MenuFriend/MenuFriend.vue";
import FeatherIcon from "@components/Icon/FeatherIcon.vue";
import LogoutButton from "@components/LogoutButton/LogoutButton.vue";
import { useAuthStore } from "@stores/AuthStore";

const isCollapsed = ref(false);
const authStore = useAuthStore();
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  position: fixed;
  height: 100vh;
}

.main {
  width: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s ease;
  height: 100%;

  &--collapsed {
    width: 66px;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.main__menu {
  flex: 1;
  display: flex;
  overflow-y: auto;
  padding-bottom: 10px;
}

.user-bar {
  margin-top: auto;
  flex-shrink: 0;
}

.collapse-btn {
  position: absolute;
  right: -10px;
  top: 39px;
  transform: translateY(-50%);
  background-color: var(--element-bg);
  width: 20px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: var(--border);
  }
}
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
