<template>
  <div class="server-members">
    <div
      v-for="(members, role) in groupedMembers"
      :key="role"
      class="role-group"
    >
      <h3 class="role-title">{{ formatRoleName(role) }}</h3>
      <ul class="members-list">
        <li
          v-for="member in members"
          :key="member.id"
          class="member"
          @contextmenu.prevent="openContextMenu($event, member)"
        >
          <div class="member-avatar">
            <img
              v-if="member.profiles?.avatar_url"
              :src="member.profiles.avatar_url"
              alt="avatar"
              class="avatar"
            />
            <div v-else class="avatar-fallback">
              {{ getInitials(member.profiles?.username || "") }}
            </div>
          </div>
          <span class="member-name">{{ member.profiles?.username }}</span>
          <span class="online-status"></span>
        </li>
      </ul>
    </div>

    <!-- Контекстное меню -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{
        top: `${contextMenu.y}px`,
        left: `${contextMenu.x}px`,
      }"
      @click.stop
    >
      <ul class="context-menu-list">
        <li class="context-menu-item" @click="handleAction('view')">
          <FeatherIcon name="user" size="16" />
          <span>Посмотреть профиль</span>
        </li>
        <li
          class="context-menu-item"
          @click="handleAction('role')"
        >
          <FeatherIcon name="shield" size="16" />
          <span>Изменить роль</span>
        </li>
        <li
          class="context-menu-item danger"
          @click="handleAction('kick')"
        >
          <FeatherIcon name="trash-2" size="16" />
          <span>Выгнать с сервера</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const route = useRoute();
const members = ref<Member[]>([]);
const loading = ref(false);
// Контекстное меню
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  targetUser: null as Member | null,
});

const fetchMembers = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get<Member[]>(
      `/servers/${route.params.id}/member`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    members.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки участников:", error);
  } finally {
    loading.value = false;
  }
};

// Группировка по ролям
const groupedMembers = computed(() => {
  const groups: Record<string, Member[]> = {};

  members.value.forEach((member) => {
    if (!groups[member.role]) {
      groups[member.role] = [];
    }
    groups[member.role].push(member);
  });

  // Сортируем роли в нужном порядке
  const orderedRoles = ["owner", "admin", "member"];
  const sortedGroups: Record<string, Member[]> = {};

  orderedRoles.forEach((role) => {
    if (groups[role]) {
      sortedGroups[role] = groups[role];
    }
  });

  return sortedGroups;
});

// Форматирование названия роли
const formatRoleName = (role: string) => {
  const roleNames: Record<string, string> = {
    owner: "Владельцы",
    admin: "Администраторы",
    member: "Участники",
  };
  return roleNames[role] || role;
};

// Получение инициалов для аватара
const getInitials = (username: string) => {
  return username.charAt(0).toUpperCase();
};

// Открытие контекстного меню
const openContextMenu = (event: MouseEvent, member: Member) => {
  if (member.role === "owner") return;

  contextMenu.value = {
    visible: true,
    x: event.pageX,
    y: event.pageY,
    targetUser: member,
  };
};

// Обработка действий в меню
const handleAction = (action: string) => {
  if (!contextMenu.value.targetUser) return;

  switch (action) {
    case "view":
      // TODO: Переход к профилю
      break;
    case "kick":
      // TODO: Удаление участника
      break;
    case "role":
      // TODO: Изменение роли
      break;
  }

  closeContextMenu();
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

// Закрытие меню при клике вне
const handleClickOutside = () => closeContextMenu();

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await Promise.all([fetchMembers()]);
    }
  },
  { immediate: false }
);
onMounted(() => {
  fetchMembers();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.server-members {
  padding: 25.5px;
  width: 200px;
  height: 100%;
  overflow-y: auto;
}

.role-title {
  font-size: var(--text-m);
  color: var(--text-secondary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--element-bg);
}

.members-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.member {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 5px 2px 5px;
  border-radius: 12px;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: var(--element-bg);
    cursor: pointer;
  }
}

.member-avatar {
  display: flex;
  align-items: center;

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }

  .avatar-fallback {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
}

.member-name {
  font-size: var(--text-m);
  color: var(--text-primary);
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; 
}

.online-status {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--ok);
  position: absolute;
  left: 34px;
  bottom: 2px;
}

.context-menu {
  position: fixed;
  background-color: var(--element-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
}

.context-menu-list {
  list-style: none;
  padding:0;
  margin: 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--text-m);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--border);
  }

  &.danger {
    color: var(--error);
  }
  &.danger:hover {
    background-color: var(--error-light);
  }
}
</style>
