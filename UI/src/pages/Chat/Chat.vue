<template>
  <TextChannelChat :currentUser="User.user" :channel="chat ?? null" />
</template>
<script setup lang="ts">
import TextChannelChat from "@components/TextChat/TextChat.vue";
import { useUserStore } from "@stores/UserStore";
import apiClient from "@/api";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
const route = useRoute();
const User = useUserStore();

const chat = ref<TextChannel>();

const fetchChat = async () => {
  try {
    const response = await apiClient.post<TextChannel>(
      `/chat/${route.params.chatId}`,
      {server_id: route.params.id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    chat.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки чата:", error);
  } finally {
  }
};

onMounted(async () => {
  await fetchChat();
});
watch(
  () => route.params.chatId,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await fetchChat();
    }
  },
  { immediate: false }
);
</script>
