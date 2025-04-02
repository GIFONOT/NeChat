<template>
  <div class="server-sidebar">
    <div class="server-sidebar__server-header">
      <h2 class="server-sidebar__server-header__label">Название сервера</h2>
      <FeatherIcon
        name="chevron-down"
        size="20"
        class="server-sidebar__server-header__chevron-down"
      />
    </div>
    <!-- Текстовые каналы -->
    <div class="server-sidebar__channel-section">
      <div class="server-sidebar__section-header">
        <span>Текстовые каналы</span>
        <FeatherIcon name="plus" size="20" class="server-sidebar__add-icon" />
      </div>
      <div class="server-sidebar__channel-list">
        <div class="channel">
          <FeatherIcon name="hash" size="20" /> основной
        </div>
        <div class="channel"><FeatherIcon name="hash" size="20" /> музыка</div>
      </div>
    </div>

    <!-- Голосовые каналы -->
    <div class="server-sidebar__channel-section">
      <div class="server-sidebar__section-header">
        <span>Голосовые каналы</span>
        <FeatherIcon name="plus" size="20" class="server-sidebar__add-icon" />
      </div>
      <div class="server-sidebar__channel-list">
        <div class="channel">
          <FeatherIcon name="volume-2" size="20" /> Общий
        </div>
        <div class="channel">
          <FeatherIcon name="volume-2" size="20" /> Игровой
        </div>
        <div class="channel">
          <FeatherIcon name="volume-2" size="20" /> Музыка
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatherIcon from "@components/Icon/FeatherIcon.vue";
const props = defineProps<{
  server: {
    id: string | string[];
  };
}>();
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
