<template>
  <div class="server-sidebar">
    <div class="server-sidebar__server-header">
      <h2 class="server-sidebar__server-header__label">{{ Server?.name }}</h2>
      <ServerDropdown
        v-if="Server"
        :server="Server"
        @action="handleServerAction"
      />
    </div>
    <!-- Текстовые каналы -->
    <div class="server-sidebar__channel-section">
      <div class="server-sidebar__section-header">
        <span>Текстовые каналы</span>
        <FeatherIcon
          name="plus"
          size="18"
          class="server-sidebar__add-icon"
          @click="addTextChenel"
        />
      </div>
      <div class="server-sidebar__channel-list">
        <div
          v-if="textChannel"
          v-for="channel in textChannel"
          :key="channel.id"
          class="channel"
          @click="selectChannel(channel)"
        >
          <FeatherIcon name="hash" size="20" />
          {{ channel.name }}
        </div>
        <CreateTCModal ref="modalRef" @create="CreatedTC" />
      </div>
    </div>

    <!-- Голосовые каналы -->
    <div class="server-sidebar__channel-section">
      <div class="server-sidebar__section-header">
        <span>Голосовые каналы</span>
        <FeatherIcon name="plus" size="18" class="server-sidebar__add-icon" />
      </div>
      <div class="server-sidebar__channel-list">
        <div class="channel">
          <!-- <FeatherIcon name="volume-2" size="20" /> Общий -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatherIcon from "@components/Icon/FeatherIcon.vue";
import ServerDropdown from "@components/ServerDetail/Menu.vue";
import { useServerStore } from "@stores/ServerStore";
import CreateTCModal from "@components/CreateTCModal/CreateTCModal.vue"
import apiClient from "@/api";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const Server = ref<Server>();
const textChannel = ref<TextChannel[]>([]);
const router = useRoute();
const serversCache = new Map<string, Server>();
const serverStore = useServerStore();
const modalRef = ref<InstanceType<typeof CreateTCModal> | null>(null);

const handleServerAction = (action: any) => {
  switch (action) {
    case "invite":
      // Логика приглашения
      break;
    case "settings":
      // Открытие настроек
      break;
    case "delete":
      // Подтверждение удаления
      break;
    // ... другие действия
  }
};
const addTextChenel = async () => {
  modalRef.value?.openModal();
};
const CreatedTC = async () => {
  await fetchTextChannels();
};

const selectChannel = (channel: TextChannel) => {
  console.log("Выбран канал:", channel.name);
};

const fetchServer = async () => {
  // Проверка на кэш
  if (serversCache.has(router.params.id as string)) {
    Server.value = serversCache.get(router.params.id as string)!;
    return;
  }
  try {
    const response = await apiClient.get<Server>(
      `/servers/${router.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    Server.value = response.data;
    serversCache.set(router.params.id as string, response.data); // Кэширование
  } catch (error) {
    console.error("Ошибка загрузки сервера:", error);
  }
};

const fetchTextChannels = async () => {
  try {
    const response = await apiClient.get<TextChannel[]>(
      `/servers/${router.params.id}/textchannels`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    textChannel.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки каналов:", error);
  } finally {
  }
};

onMounted(async () => {
  await fetchServer();
  await fetchTextChannels();
});

watch(
  () => router.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchServer();
      fetchTextChannels();
    }
  }
);
</script>

<style lang="scss">
.server-sidebar {
  width: 240px;
  height: auto;
  padding: 25px 0px 0px 25px;
  border-left: 1px solid var(--element-bg);

  &__server-header {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid var(--element-bg);
    margin-bottom: 15px;

    &__chevron-down {
      :hover {
        cursor: pointer;
      }
    }
    &__label {
      flex: 1;
      margin: 0;
      font-size: 16px;
    }
  }
  &__add-icon {
    :hover {
      cursor: pointer;
      color: var(--text-primary);
    }
  }

  &__channel-section {
    margin-bottom: 20px;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary);
    font-size: 12px;
    margin-bottom: 8px;
    align-items: center;
  }

  &__channel-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
}

.channel {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.channel:hover {
  background: var(--element-bg);
}
</style>
