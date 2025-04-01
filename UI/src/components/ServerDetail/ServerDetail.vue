<template>
  <div class="server-container">
    <!-- Шапка сервера -->
    <div class="server-header">
      <h2 class="server-title">{{ props.server.name }}</h2>
      <div class="server-actions">
        <button class="btn-create-channel" @click="createTestChannel">
          <FeatherIcon name="plus" size="16" />
          Создать тестовый канал
        </button>
      </div>
    </div>

    <!-- Список каналов -->
    <div class="channels-list">
      <div v-if="channels.length === 0" class="empty-state">
        Каналы отсутствуют
      </div>
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="channel-item"
        :class="{ active: activeChannelId === channel.id }"
        @click="selectChannel(channel.id)"
      >
        <span class="channel-prefix">#</span>
        <span class="channel-name">{{ channel.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

interface Channel {
  id: string;
  name: string;
}

// Принимаем данные сервера через props
const props = defineProps<{
  server: {
    id: string | string[];
    name: string | string[];
    image?: string;
  };
}>();

const channels = ref<Channel[]>([]);
const activeChannelId = ref<string | null>(null);

// Создание тестового канала
const createTestChannel = () => {
  const newChannelId = Date.now().toString();
  const newChannel = {
    id: newChannelId,
    name: `канал-${channels.value.length + 1}`,
  };

  channels.value.push(newChannel);
  selectChannel(newChannelId);
};

// Выбор канала
const selectChannel = (channelId: string) => {
  activeChannelId.value = channelId;
  // Здесь можно добавить логику загрузки сообщений канала
};
</script>

<style scoped lang="scss">
.server-container {
  background-color: var(--element-bg);
  position: fixed;
  top: 100px;
  left: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.server-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.server-title {
  margin: 0;
  font-size: var(--text-xl);
  color: var(--text-primary);
}

.server-actions {
  display: flex;
  gap: 12px;
}

.btn-create-channel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--text-m);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary);
  }
}

.channels-list {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.empty-state {
  padding: 16px;
  text-align: center;
  color: var(--text-primary);
  opacity: 0.6;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s;

  &:hover {
    background-color: var(--border);
  }

  &.active {
    background-color: var(--accent);
    color: white;
  }
}

.channel-prefix {
  margin-right: 6px;
  font-weight: bold;
}

.channel-name {
  font-size: var(--text-m);
}
</style>
