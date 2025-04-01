<template>
  <div class="servers-sidebar">
    <div class="servers-sidebar__header">
      <h3 class="servers-sidebar__title">Серверы</h3>
      <FeatherIcon
        name="plus"
        size="20"
        class="servers-sidebar__add-icon"
        @click="addServer"
      />
    </div>

    <div class="servers-sidebar__list">
      <div
        v-for="server in servers"
        :key="server.id"
        class="server-card"
        :class="{ 'server-card--active': activeServerId === server.id }"
        @click="selectServer(server.id)"
      >
        <img
          v-if="server.image"
          :src="server.image"
          class="server-card__image"
        />
        <div v-else class="server-card__placeholder">
          {{ server.name.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
    <CreateServerModal 
      ref="modalRef" 
      @create="createNewServer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { useRouter } from "vue-router";
import CreateServerModal from "@/components/CreateServerModal.vue";
import Search from "@components/Search.vue"

interface Server {
  id: string;
  name: string;
  image?: string;
}

// Запрос к серверу
const servers = ref<Server[]>([
  {
    id: "1",
    name: "Основной",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs3Nv1dUHgTVa6Ic6VI-NH3BTQixaZmoLItQ&s",
  },
  {
    id: "2",
    name: "СИгры",
  },
  { id: "3", name: "ВРазработка" },
  {
    id: "4",
    name: "ОМузыка",
  },
]);

const activeServerId = ref("");
const router = useRouter();

const selectServer = (id: string) => {
  activeServerId.value = id;
  router.push({
    name: "server-detail",
    params: { id },
  });
};
// Запрос к серверу (можно вынести управление в класс pinia)
const modalRef = ref<InstanceType<typeof CreateServerModal> | null>(null);
const addServer = () => {
  modalRef.value?.openModal();
};
const createNewServer = (newServer: { name: string; image?: string }) => {
  const newId = (servers.value.length + 1).toString();
  servers.value.push({
    id: newId,
    name: newServer.name,
    image: newServer.image
  });
};
</script>

<style lang="scss" scoped>
.servers-sidebar {
  display: flex;
  flex-direction: column;
  width: 72px;
  height: 80vh;
  top: 10px;
  //background-color: var(--element-bg);
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

  &__add-icon {
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
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
</style>
