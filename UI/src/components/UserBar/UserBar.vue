<template>
  <div class="UserBar" :class="{ 'UserBar--compact': compact }">
    <div class="UserBar__avatar" @click="toggleCompactIfCollapsed">
      <img v-if="user.image" :src="user.image" class="UserBar__image" />
      <span v-if="!compact" class="UserBar__name">
        {{ user.name }}
      </span>
    </div>

    <div class="UserBar__controls">
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
        name="settings"
        size="24"
        strokeWidth="2.5"
        @click="openProfileModal"
      />
    </div>
  </div>

  <UserProfile ref="profileModalRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import UserProfile from "@/components/UserProfile/UserProfile.vue";
import { useUserStore } from "@stores/UserStore";

const user = useUserStore();
const profileModalRef = ref<InstanceType<typeof UserProfile> | null>(null);

const openProfileModal = () => {
  profileModalRef.value?.openModal();
};

const props = defineProps({
  compact: Boolean,
});

const toggleCompactIfCollapsed = () => {
  if (props.compact) {
    // Здесь можно добавить логику для временного раскрытия
  }
};
</script>

<style lang="scss" scoped>
.UserBar {
  display: flex;
  align-items: center;
  height: 35px;
  padding: 15px;
  gap: 14px;
  border-top: 1px solid var(--element-bg);

  &--compact {
    flex-direction: column-reverse;
    height: auto;
    padding: 15px 0px 10px 0px;
    gap: 8px;

    .UserBar__controls {
      flex-direction: column-reverse;
    }
  }

  &__avatar {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  &__image {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__name {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__controls {
    display: flex;
    gap: 12px;
    margin-left: auto;

    .UserBar--compact & {
      margin-left: 0;
      margin-top: 4px;
    }
  }

  &__icon {
    cursor: pointer;
    transition: all 0.1s;
    color: var(--text-secondary);

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
