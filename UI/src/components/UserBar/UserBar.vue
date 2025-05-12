<template>
  <div class="UserBar" :class="{ 'UserBar--compact': compact }">
    <div class="UserBar__avatar" @click="toggleCompactIfCollapsed">
      <img v-if="user.image" :src="user.image" class="UserBar__image" />
      <span v-if="!compact" class="UserBar__name">
        {{ user.username }}
      </span>
    </div>

    <div class="UserBar__controls">
      <FeatherIcon
        class="UserBar__icon"
        :key="mic ? 'mic' : 'mic-off'"
        :name="mic ? 'mic' : 'mic-off'"
        size="24"
        strokeWidth="2.5"
        @click="toggleMic"
      />
      <FeatherIcon
        class="UserBar__icon"
        :key="sound ? 'volume-2' : 'volume-x'"
        :name="sound ? 'volume-2' : 'volume-x'"
        size="24"
        strokeWidth="2.5"
        @click="toggleSound"
      />
      <FeatherIcon
        class="UserBar__icon"
        name="settings"
        size="24"
        strokeWidth="2.5"
        @click="openProfileModal"
      />
    </div>
    <UserProfile ref="profileModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import UserProfile from "@/components/UserProfile/UserProfile.vue";
import { useUserStore } from "@stores/UserStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const user = computed(() => userStore.user); // теперь user — это данные пользователя
const mic = computed(() => userStore.mic);
const sound = computed(() => userStore.sound);
const profileModalRef = ref<InstanceType<typeof UserProfile> | null>(null);
const route = useRouter();

const toggleMic = () => {
  userStore.toggleMic();
};

const toggleSound = () => {
  userStore.toggleSound();
};

const openProfileModal = () => {
  profileModalRef.value?.openModal(user);
};

const props = defineProps({
  compact: Boolean,
});

const toggleCompactIfCollapsed = () => {
  route.push("/home")
  if (props.compact) {
    
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
    max-width: 150px;
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
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
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
