<template>
  <div class="direct-container">
    <div class="direct-header">
      <img
        v-if="friend?.avatar_url"
        :src="friend.avatar_url"
        class="direct-avatar"
      />
      <div v-else class="direct-placeholder">
        {{ friend?.username?.charAt(0).toUpperCase() }}
      </div>
      <h2 class="direct-username">{{ friend?.username }}</h2>
      <DirectDropdown v-if="friend" :friend="friend" @action="handleFriendAction" />
    </div>
    <router-view v-if="isLoaded" />
    <TextChat v-if="friend" :friendId="friend.user_id" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api";
import DirectDropdown from "@components/DirectDetail/DirectDropdown.vue";
import TextChat from "@components/DirectDetail/TextChat.vue";

const route = useRoute();
const friend = ref<any>(null);
const isLoaded = ref(false);

const fetchFriend = async () => {
  try {
    const response = await apiClient.get(`/friends/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    friend.value = response.data;
  } catch (e) {
    console.error("Ошибка загрузки друга:", e);
  } finally {
    isLoaded.value = true;
  }
};

onMounted(fetchFriend);

watch(
  () => route.params.id,
  async () => {
    isLoaded.value = false;
    await fetchFriend();
  }
);

const handleFriendAction = (action: string) => {
  switch (action) {
    case "remove-friend":
       if (!friend.value?.user_id) return;

      try {
        apiClient.delete(`/friends/remove/${friend.value.user_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        window.location.href = "/home"; // или router.push('/home')
      } catch (e) {
        console.error("Ошибка при удалении друга:", e);
      }
      break;

    case "block":
      // TODO: вызвать API для блокировки
      break;
  }
};

</script>

<style scoped lang="scss">
.direct-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.direct-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 25px;
  z-index: 10;
  width: 91%;
}

.direct-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.direct-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: var(--text-primary);
}

.direct-username {
  font-size: 18px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>