<template>
  <div class="friend-sidebar">
    <div class="friend-sidebar__header">
      <h3 class="friend-sidebar__title">Друзья</h3>
      <FeatherIcon name="plus" size="20" class="friend-sidebar__add-icon" />
    </div>

    <div class="friend-sidebar__list">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="friend-card"
        :class="{ 'friend-card--active': activeFriendId === friend.id }"
        @click="selectFriend(friend.id)"
      >
        <div class="friend-card__avatar">
          <img
            v-if="friend.image"
            :src="friend.image"
            class="friend-card__image"
          />
          <div v-else class="friend-card__placeholder">
            {{ friend.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <span class="friend-card__name">{{ friend.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { useRouter } from "vue-router";

interface Friend {
  id: string;
  name: string;
  image?: string;
}

const friends = ref<Friend[]>([
]);

const activeFriendId = ref("");
const router = useRouter();

const selectFriend = (id: string) => {
  activeFriendId.value = id;
  router.push({
    // ваша логика навигации
  });
};
</script>

<style lang="scss" scoped>
.friend-sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 8px 0px 8px 10px;
  overflow-y: auto;
  scrollbar-width: none;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--element-bg);
  }

  &__title {
    font-size: var(--text-m);
    margin-bottom: 8px;
  }

  &__add-icon {
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;

  &:hover {
    background-color: var(--element-bg);
  }

  &--active {
    background-color: var(--element-bg);
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-primary);
  }

  &__name {
    font-size: 14px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
