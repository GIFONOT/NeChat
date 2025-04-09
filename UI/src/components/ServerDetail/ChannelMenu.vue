<template>
  <div class="channel-actions">
    <FeatherIcon
      class="channel-more-btn"
      name="more-horizontal"
      size="16"
      @click="toggleMenu"
    />
    <div v-if="isOpen" class="channel-menu">
      <div class="channel-menu__item" @click="handleEdit">
        <FeatherIcon name="edit-2" size="14" />
        <span>Изменить</span>
      </div>
      <div
        class="channel-menu__item channel-menu__item--danger"
        @click="handleDelete"
      >
        <FeatherIcon name="trash-2" size="14" />
        <span>Удалить</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const props = defineProps({
  channel: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleEdit = () => {
  closeMenu();
  emit("edit", props.channel);
};

const handleDelete = () => {
  closeMenu();
  emit("delete", props.channel);
};
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.channel-actions')) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.channel-actions {
  margin-left: auto;
  position: relative;
}

.channel-more-btn {
  color: var(--text-secondary) !important;
  cursor: pointer;

  :hover {
    color: var(--text-primary);
  }
}

.channel-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: var(--element-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 160px;
  overflow: hidden;

  &__item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: var(--border);
    }

    .feather-icon {
      margin-right: 8px;
      width: 14px;
      height: 14px;
    }

    &--danger {
      color: var(--error);

      &:hover {
        background-color: var(--error-light);
      }
    }
  }
}
</style>
