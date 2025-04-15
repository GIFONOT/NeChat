<template>
  <div class="friend-sidebar">
    <div class="friend-sidebar__header">
      <h3 class="friend-sidebar__title">Друзья</h3>
      <div class="friend-sidebar__icons">
        <div class="icon-wrapper">
          <FeatherIcon name="plus" size="20" class="friend-sidebar__icon" @click="openAddFriendModal" />
          <FeatherIcon name="user-check" size="20" class="friend-sidebar__icon" @click="openRequestsModal" />
          <span v-if="hasIncomingRequests" class="request-indicator" />
        </div>
      </div>
    </div>

    <div class="friend-sidebar__list">
      <Loading :isLoading="isLoading" />
      <div
        v-for="friend in friends"
        :key="friend.user_id"
        class="friend-card"
        :class="{ 'friend-card--active': activeFriendId === friend.user_id  }"
        @click="selectFriend(friend.user_id )"
      >
        <div class="friend-card">
          <img
            v-if="friend.avatar_url"
            :src="friend.avatar_url"
            class="friend-card__image"
          />
          <div v-else class="friend-card__placeholder">
            {{ friend.username.charAt(0).toUpperCase() }}
          </div>
        </div>
        <span class="friend-card__name">{{ friend.username }}</span>
      </div>
    </div>
    <AddFriendModal ref="addModalRef" @request-sent="refreshFriends" />
    <FriendRequestsModal ref="requestsModalRef" @responded="refreshFriends" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { useRouter } from "vue-router";
import apiClient from "@/api";
import Loading from "@/components/Loading.vue";
import AddFriendModal from "@/components/AddFriendModal/AddFriendModal.vue";
import FriendRequestsModal from "@/components/FriendRequestsModal/FriendRequestsModal.vue";

const friends = ref<Friend[]>([]);
const activeFriendId = ref("");
const isLoading = ref(true);
const hasIncomingRequests = ref(false);

const addModalRef = ref<InstanceType<typeof AddFriendModal> | null>(null);
const requestsModalRef = ref<InstanceType<typeof FriendRequestsModal> | null>(null);

const checkIncomingRequests = async () => {
  try {
    const res = await apiClient.get("/friends/requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    hasIncomingRequests.value = res.data.incoming?.length > 0;
  } catch (e) {
    console.error("Ошибка при проверке заявок:", e);
  }
};

const openAddFriendModal = () => {
  addModalRef.value?.openModal();
};

const openRequestsModal = () => {
  requestsModalRef.value?.openModal();
};

const router = useRouter();

const selectFriend = (id: string) => {
  activeFriendId.value = id;
  router.push({ name: "direct-message", params: { id } });
};

const fetchFriends = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get("/friends/friendsList", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    friends.value = response.data;
  } catch (e) {
    console.error("Ошибка при загрузке друзей:", e);
    friends.value = [];
  } finally {
    isLoading.value = false;
  }
};

const refreshFriends = async () => {
  await fetchFriends();
  await checkIncomingRequests();
};

onMounted(() => {
  fetchFriends();
  checkIncomingRequests();
});
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

  &__icons {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  &__icon {
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
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
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;

  &:hover {
    background-color: var(--element-bg);
  }

  &--active {
    background-color: var(--element-bg);
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 20%;
    object-fit: cover;
  }

  &__placeholder {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-primary);
  }

  &__name {
    font-size: 20px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.icon-wrapper {
  position: relative;
  display: flex;
  gap: 8px;
}

.request-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: var(--error-dark);
  border-radius: 50%;
}
</style>
