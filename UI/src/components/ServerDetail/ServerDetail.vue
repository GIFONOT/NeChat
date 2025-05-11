<template>
  <div class="server-container">
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
            v-if="
              Server?.user_role && ['owner', 'admin'].includes(Server.user_role)
            "
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
            :class="{ 'channel--active': activeChannelId === channel.id }"
            @click="selectChannel(channel)"
          >
            <FeatherIcon name="hash" size="20" />
            <span class="server-sidebar__channel-list__label">{{
              channel.name
            }}</span>
            <ChannelMenu
              v-if="
                Server?.user_role &&
                ['owner', 'admin'].includes(Server.user_role)
              "
              :channel="channel"
              @edit="editChannel"
              @delete="deleteChannel"
            />
          </div>
          <CreateTCModal ref="modalRef" @create="CreatedTC" />
        </div>
      </div>

      <!-- Голосовые каналы -->
      <div class="server-sidebar__channel-section">
        <div class="server-sidebar__section-header">
          <span>Голосовые каналы</span>
          <FeatherIcon
            v-if="
              Server?.user_role && ['owner', 'admin'].includes(Server.user_role)
            "
            name="plus"
            size="18"
            class="server-sidebar__add-icon"
            @click="addVoiceChannel"
          />
        </div>
        <div class="server-sidebar__channel-list">
          <div 
            v-for="channel in voiceChannels"
            :key="channel.id"
            class="channel"
          >
            <FeatherIcon name="volume-2" size="20" />
            <span class="server-sidebar__channel-list__label">{{ channel.name }}</span>
            <ChannelMenu
              v-if="
                Server?.user_role &&
                ['owner', 'admin'].includes(Server.user_role)
              "
              :channel="channel"
              @edit="editVoiceChannel"
              @delete="deleteVoiceChannel"
            />
          </div>
          <CreateVCModal ref="voiceModalRef" @create="CreatedVC" />
        </div>
      </div>
    </div>
    <InvitationsServerModal ref="inviteModal" :server="Server ?? null" />
    <router-view v-if="isLoaded" />
  </div>
</template>

<script setup lang="ts">
import FeatherIcon from "@components/Icon/FeatherIcon.vue";
import ServerDropdown from "@components/ServerDetail/Menu.vue";
import { useServerStore } from "@stores/ServerStore";
import CreateTCModal from "@components/CreateChannelModal/CreateTCModal.vue";
import CreateVCModal from "@components/CreateChannelModal/CreateVCModal.vue";
import ChannelMenu from "@components/ServerDetail/ChannelMenu.vue";
import InvitationsServerModal from "@components/InvitationsServerModal/InvitationsServerModal.vue"
import apiClient from "@/api";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const Server = ref<Server>();
const textChannel = ref<TextChannel[]>([]);
const voiceChannels = ref<VoiceChannel[]>([]);
const router = useRoute();
const rout = useRouter();
const serversCache = new Map<string, Server>();
const serverStore = useServerStore();
const modalRef = ref<InstanceType<typeof CreateTCModal> | null>(null);
const voiceModalRef = ref<InstanceType<typeof CreateVCModal> | null>(null);
const activeChannelId = ref("");
const isLoaded = ref(false);

const inviteModal = ref<InstanceType<typeof InvitationsServerModal> | null>(null);
const handleServerAction = async (action: any) => {
  switch (action) {
    case "invite":
      inviteModal.value?.openModal();
      break;
    case "settings":
      // Открытие настроек
      break;
    case "delete":
      await delServer();
      rout.push("/home").then(() => {
        window.location.reload(); // ну да кастыль своего рода )))) но впадлу чистить кеш
      });
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

const CreatedVC = async () => {
  await fetchVoiceChannels();
};
const editChannel = (channel: any) => {};

const editVoiceChannel = (channel: any) => {};

const addVoiceChannel = async () => {
  voiceModalRef.value?.openModal();
};

const deleteChannel = async (channel: any) => {
  await delTextChannels(channel.id);
  await fetchTextChannels();
};

const deleteVoiceChannel = async (channel: any) => {
  await delVoiceChannels(channel.id);
  await fetchVoiceChannels();
};

const selectChannel = (channel: TextChannel) => {
  activeChannelId.value = channel.id;
  const chatId = channel.id;
  rout.push({
    name: "chat",
    params: { chatId },
  });
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

const fetchVoiceChannels = async () => {
  try {
    const res = await apiClient.get<VoiceChannel[]>(
      `/servers/${router.params.id}/voicechannels`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    voiceChannels.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки голосовых каналов", e);
  }
};

const delTextChannels = async (channel_id: string) => {
  try {
    const response = await apiClient.delete(
      `/servers/${router.params.id}/del/textchannels/${channel_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Ошибка удаления канала:", error);
  } finally {
  }
};

const delVoiceChannels = async (channel_id: string) => {
  try {
    const response = await apiClient.delete(
      `/servers/${router.params.id}/del/voicechannels/${channel_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Ошибка удаления канала:", error);
  } finally {
  }
};

const delServer = async () => {
  try {
    const response = await apiClient.delete(`/servers/${router.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Ошибка удаления сервера:", error);
  } finally {
  }
};

onMounted(async () => {
  await Promise.all([fetchServer(), fetchTextChannels(), fetchVoiceChannels()]);
  isLoaded.value = true;
});

watch(
  () => router.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      isLoaded.value = false;
      await Promise.all([fetchServer(), fetchTextChannels(), fetchVoiceChannels()]);
      isLoaded.value = true;
    }
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.server-container {
  display: flex;
}
.server-sidebar {
  width: 240px;
  height: auto;
  padding: 25px 25px 0px 25px;
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
    min-height: 18px;
    color: var(--text-secondary);
    font-size: 12px;
    margin-bottom: 8px;
    align-items: center;
  }

  &__channel-list {
    display: flex;
    flex-direction: column;
    gap: 3px;

    &__label {
      flex: 1;
    }
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

  &--active {
    background: var(--element-bg);
  }
}

.channel:hover {
  background: var(--element-bg);
}
</style>
