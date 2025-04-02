<template>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserBar from "@components/UserBar/UserBar.vue";
import MenuServer from "@components/MenuServer/MenuServer.vue";
import ThemeToggle from "@components/ThemeToggle.vue";
import Search from "@components/Search.vue";
import MenuFriend from "@components/MenuFriend/MenuFriend.vue";
import FeatherIcon from "@components/Icon/FeatherIcon.vue";

const isCollapsed = ref(false);

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
</style>
