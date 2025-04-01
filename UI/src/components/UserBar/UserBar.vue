<template>
  <div class="UserBar">
    <div class="UserBar__name">
      <img v-if="user.image" :src="user.image" class="UserBar__image" />
      {{ user.name }}
    </div>
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
  //position: fixed;
  align-items: center;
  //bottom: 10px;
  //left: 10px;
  z-index: 100;
  width: auto;
  height: 35px;
  //background-color: var(--element-bg);
  //border-radius: 12px;
  padding: 15px 15px 15px 15px;
  gap: 14px;
  border-top: 1px solid var(--element-bg);

  &__name {
    font-size: var(--text-xl);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    cursor: pointer;
    :hover {
      cursor: pointer;
      background-color: var(--element-bg);
    }
  }
  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__icon {
    :hover {
      cursor: pointer;
    }
  }
}
</style>
