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
            <div
              v-if="
                Server?.user_role &&
                ['owner', 'admin'].includes(Server.user_role)
              "
              @click.stop
            >
              <ChannelMenu
                :channel="channel"
                @edit="editChannel"
                @delete="deleteChannel"
              />
            </div>
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
            class="channel voice-channel"
            @click="selectVoiceChannel(channel)"
          >
            <div class="channel-header">
              <FeatherIcon name="volume-2" size="20" />
              <span class="server-sidebar__channel-list__label">{{ channel.name }}</span>
              <div class="channel-actions">
                <FeatherIcon
                  v-if="currentVoiceChannel?.id === channel.id"
                  name="phone-off"
                  size="18"
                  class="voice-leave-icon"
                  @click.stop="leaveVoiceChannel"
                />
                <div
                  v-if="
                    Server?.user_role &&
                    ['owner', 'admin'].includes(Server.user_role)
                  "
                  @click.stop
                >
                  <ChannelMenu
                    :channel="channel"
                    @edit="editVoiceChannel"
                    @delete="deleteVoiceChannel"
                  />
                </div>
              </div>
            </div>
            <!-- Участники -->
            <div class="voice-members">
              <div
                v-for="member in serverStore.voiceMembers[channel.id] || []"
                :key="member.user_id"
                class="voice-member"
              >
                <img :src="member.avatar_url" class="voice-avatar" />
                <span>{{ member.username }}</span>
                <div class="voice-status-icons">
                  <FeatherIcon
                    :name="member.mic === false ? 'mic-off' : 'mic'"
                    size="16"
                    class="voice-icon"
                  />
                  <FeatherIcon
                    :name="member.sound === false ? 'volume-x' : 'volume-2'"
                    size="16"
                    class="voice-icon"
                  />
                </div>
              </div>
            </div>
          </div>
          <CreateVCModal ref="voiceModalRef" @create="CreatedVC" />
        </div>
      </div>
    </div>
    <InvitationsServerModal ref="inviteModal" :server="Server ?? null" />
    <router-view v-if="isLoaded" />
    <ServerMembers />
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
import ServerMembers from "@/components/ServerMembers/ServerMembers.vue"
import apiClient from "@/api";
import { onMounted, onUnmounted, ref, watch } from "vue";
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
const currentVoiceChannel = ref<VoiceChannel | null>(null);
const voiceMembers = ref<VoiceMember[]>([]);
const heartbeatInterval = ref<number | null>(null);
let refreshMembersInterval: number | null = null;

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
    await serverStore.preloadAllVoiceMembers(router.params.id as string, voiceChannels.value);
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

const selectVoiceChannel = async (channel: VoiceChannel) => {
  try {
    // Если уже подключен к другому каналу — выйти из него
    if (currentVoiceChannel.value && currentVoiceChannel.value.id !== channel.id) {
      await apiClient.post(
        `/servers/${router.params.id}/voicechannels/${currentVoiceChannel.value.id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }

    await apiClient.post(
      `/servers/${router.params.id}/voicechannels/${channel.id}/join`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    currentVoiceChannel.value = channel;
    await loadVoiceMembers(channel.id);

    // Пульс
    if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
    heartbeatInterval.value = window.setInterval(() => {
      serverStore.heartbeat(router.params.id as string, channel.id);
    }, 3000); // 3 секунды
  } catch (e) {
    console.error("Ошибка входа в голосовой канал", e);
  }
};

const loadVoiceMembers = async (channelId: string) => {
  try {
    const res = await apiClient.get(
      `/servers/${router.params.id}/voicechannels/${channelId}/members`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    voiceMembers.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки участников голосового канала", e);
  }
};

const leaveVoiceChannel = async () => {
  if (!currentVoiceChannel.value) return;
  try {
    await apiClient.post(
      `/servers/${router.params.id}/voicechannels/${currentVoiceChannel.value.id}/leave`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    currentVoiceChannel.value = null;
    voiceMembers.value = [];
    if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
  } catch (e) {
    console.error("Ошибка выхода из голосового канала", e);
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

  refreshMembersInterval = window.setInterval(() => {
    if (router.params.id) {
      serverStore.preloadAllVoiceMembers(router.params.id as string, voiceChannels.value);
    }
    if (currentVoiceChannel.value) {
      loadVoiceMembers(currentVoiceChannel.value.id);
    }
  }, 4000); // обновлять каждые 4 секунды

  // Автоматический выход при закрытии вкладки
  window.addEventListener("beforeunload", leaveVoiceChannel);
});

onUnmounted(() => {
  if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
  if (refreshMembersInterval) clearInterval(refreshMembersInterval);
  window.removeEventListener("beforeunload", leaveVoiceChannel);
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
  border-right: 1px solid var(--element-bg);

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
      font-size: var(--text-l);
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
  color: var(--text-secondary);
  cursor: pointer;

  &--active {
    background: var(--element-bg);
    color: var(--text-primary);
  }

  &:hover {
    background: var(--element-bg);
  }
}

// Специфичные стили для голосовых каналов
.voice-channel {
  flex-direction: column; // Вертикальное расположение для голосовых
  align-items: flex-start;
  
  .channel-header {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 5px;
  }
}

.channel:hover {
  background: var(--element-bg);
  color: var(--text-primary);
}

// Стили для верхней строки (иконка + название + действия)
.channel-header {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 5px;
}

.server-sidebar__channel-list__label {
  flex: 1;
}

.voice-members {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 4px 0 0 25px; // Отступ слева для выравнивания с иконкой канала
}
.voice-member {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  .voice-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
  }
}

// Стили для иконок действий (меню и выход)
.channel-actions {
  display: flex;
  gap: 8px;
  margin-left: auto; 
  align-items: center;
  padding-left: 10px;
  background: inherit;
}

.channel--active .channel-actions {
  padding-right: 2px;
}

.voice-leave-icon {
  color: var(--error-color);
  &:hover {
    color: var(--error-color-hover);
  }
}

.voice-status-icons {
  display: flex;
  gap: 6px;
}

.voice-icon {
  color: var(--text-secondary);
}
</style>