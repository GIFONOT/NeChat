<template>
  <div class="dropdown-container">
    <button class="dropdown-trigger" @mousedown.stop="toggleMenu">
      <FeatherIcon
        name="chevron-down"
        size="20"
        class="server-sidebar__server-header__chevron-down"
      />
    </button>
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <button
          v-for="item in filteredMenuItems"
          :key="item.action"
          class="dropdown-item"
          :class="{ danger: item.danger }"
          @click="handleAction(item.action)"
        >
          <FeatherIcon :name="item.icon" size="16" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const props = defineProps<{
  server: Server;
}>();

const emit = defineEmits(["action"]);

const isOpen = ref(false);

// Все возможные пункты меню
const menuItems = [
  {
    action: "invite",
    label: "Пригласить",
    icon: "user-plus",
    roles: ["owner", "admin", "member"],
  },
  {
    action: "settings",
    label: "Настройки",
    icon: "settings",
    roles: ["owner", "admin"],
  },
  {
    action: "manage-members",
    label: "Участники",
    icon: "users",
    roles: ["owner", "admin", "member"],
  },
  {
    action: "leave",
    label: "Покинуть сервер",
    icon: "log-out",
    roles: ["admin", "member"],
    danger: true,
  },
  {
    action: "delete",
    label: "Удалить сервер",
    icon: "trash-2",
    roles: ["owner"],
    danger: true,
  },
];

// Фильтруем пункты по роли пользователя
const filteredMenuItems = computed(() => {
  return menuItems.filter((item) =>
    item.roles.includes(props.server.user_role)
  );
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleAction = (action: string) => {
  emit("action", action);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-container')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text-primary);
  }
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  min-width: 200px;
  background-color: var(--element-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--text-l);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--border);
  }
}
.dropdown-item.danger:hover {
  background-color: var(--error-light);
}
.dropdown-item.danger {
  color: var(--error);
}

// Анимации
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
