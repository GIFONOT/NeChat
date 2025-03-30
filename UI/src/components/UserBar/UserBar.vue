<template>
  <div class="UserBar">
    <span class="UserBar__name">{{ user.name }}</span>
    <FeatherIcon
      class="UserBar__icon"
      :key="user.mic ? 'mic' : 'mic-off'"
      :name="user.mic ? 'mic' : 'mic-off'"
      size="24"
      strokeWidth="2.5"
    />
    <FeatherIcon
      class="UserBar__icon"
      :key="user.mic ? 'volume-2' : 'volume-x'"
      :name="user.mic ? 'volume-2' : 'volume-x'"
      size="24"
      strokeWidth="2.5"
    />
    <FeatherIcon
      class="UserBar__icon"
      :name="'settings'"
      size="24"
      strokeWidth="2.5"
    />
  </div>
</template>

<script setup lang="ts">
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { UserStores } from "@stores/UserStore";

const user = UserStores();
</script>

<style lang="scss">
.UserBar {
  display: flex;
  width: max-content;
  position: fixed;
  align-items: center;
  bottom: 10px;
  left: 10px;
  z-index: 100;
  width: 300px;
  height: 35px;
  background-color: var(--element-bg);
  //border: 1px solid var(--border);
  padding: 8px 10px 8px 10px;
  gap: 14px;
  border-radius: 10px;
  &__name {
    font-size: var(--text-xl);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  &__icon {
    :hover {
      cursor: pointer;
    }
  }
}
</style>
