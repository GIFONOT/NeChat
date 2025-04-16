<template>
  <div class="servers-sidebar">
    <div class="servers-sidebar__header">
      <h3 class="servers-sidebar__title">Серверы</h3>
      <div class="icon-wrapper">
        <FeatherIcon
        name="plus"
        size="20"
        class="servers-sidebar__icon"
        @click="addServer"
      />
        <FeatherIcon
          name="bell"
          size="20"
          class="servers-sidebar__icon"
          @click="chekInvitations"
        />
        <span v-if="hasIncomingRequests" class="request-indicator" />
      </div>
    </div>

    <div class="servers-sidebar__list">
      <Loading :isLoading="isLoading" />
      <div
        v-for="server in userServers"
        :key="server.id"
        class="server-card"
        :class="{ 'server-card--active': activeServerId === server.id }"
        @click="selectServer(server.id)"
      >
        <img
          v-if="server.image_url"
          :src="server.image_url"
          class="server-card__image"
        />
        <div v-else class="server-card__placeholder">
          {{ server.name.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
    <CreateServerModal ref="modalRef" @create="handleServerCreated" />
    <ChekInvitationsModal ref="modalchekInvitations" @responded="handleServerCreated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { useRouter, useRoute } from "vue-router";
import CreateServerModal from "@components/CreateServerModal/CreateServerModal.vue";
import ChekInvitationsModal from "@components/ChekInvitationsModal/ChekInvitationsModal.vue"
import Loading from "@/components/Loading.vue";
import apiClient from "@/api";

const activeServerId = ref("");
const router = useRouter();
const rout = useRoute();
const userServers = ref<Server[]>([]);
const isLoading = ref(true);
const hasIncomingRequests = ref(false);

const modalRef = ref<InstanceType<typeof CreateServerModal> | null>(null);
const modalchekInvitations = ref<InstanceType<typeof CreateServerModal> | null>(null);

const addServer = () => {
  modalRef.value?.openModal();
};
const chekInvitations = () => {
  modalchekInvitations.value?.openModal();
};

const selectServer = (id: string) => {
  activeServerId.value = id;
  router.push({
    name: "server-detail",
    params: { id },
  });
};

const fetchUserServers = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get<Server[]>("/servers/my-servers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    userServers.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки серверов:", error);
    userServers.value = [];
  } finally {
    isLoading.value = false;
  }
};
const checkIncomingRequests = async () => {
  try {
    const res = await apiClient.get("servers/invites/requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    hasIncomingRequests.value = res.data.incoming?.length > 0;
  } catch (e) {
    console.error("Ошибка при проверке заявок:", e);
  }
};
const handleServerCreated = async () => {
  await fetchUserServers();
  await checkIncomingRequests();
};
onMounted(async () => {
  await fetchUserServers();
  await checkIncomingRequests();
  if (rout.params.id) {
    activeServerId.value = rout.params.id as string;
  }
});
</script>

<style lang="scss" scoped>
.servers-sidebar {
  display: flex;
  flex-direction: column;
  width: 72px;
  top: 10px;
  border-right: 1px solid var(--element-bg);
  padding: 8px 10px 8px 10px;
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

  &__icon {
    margin-bottom: 10px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}

.server-card {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-radius: 30%;
  }

  &--active {
    border-radius: 30%;
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
