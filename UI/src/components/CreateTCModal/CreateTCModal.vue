<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Новый канал</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body__form-group">
          <label for="channel-name">Название канала</label>
          <input
            id="channel-name"
            v-model="channelData.name"
            type="text"
            placeholder="Введите название канала"
          />
        </div>

        <div class="modal-body__form-group">
          <label for="channel-description">Описание (необязательно)</label>
          <textarea
            id="channel-description"
            v-model="channelData.description"
            placeholder="Добавьте описание канала"
            rows="3"
          ></textarea>
        </div>

        <div class="modal-body__form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="channelData.is_private"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            Приватный канал
          </label>
          <p class="checkbox-description">
            Только участники с разрешением смогут просматривать и участвовать в
            этом канале
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-footer__cancel-btn" @click="closeModal">
          Отмена
        </button>
        <button
          class="modal-footer__create-btn"
          @click="addTextChenel"
          :disabled="!channelData.name"
        >
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import apiClient from "@/api";
import { useServerStore } from "@stores/ServerStore";
import { useRoute } from "vue-router";

const emit = defineEmits(["create", "close"]);
const serverStore = useServerStore();
const rout = useRoute();

const isOpen = ref(false);
const channelData = ref({
  name: "Новый канал",
  description: "",
  is_private: false,
});

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  channelData.value = {
    name: "Новый канал",
    description: "",
    is_private: false,
  };
};
const addTextChenel = async () => {
  try {
    const response = await apiClient.post<TextChannel>(
      `/servers/${rout.params.id}/add/textchannels`,
      channelData.value,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    emit("create", response.data);
    closeModal();
  } catch (error) {
    console.error("Ошибка создания текстового канала:", error);
  }
};
defineExpose({ openModal });
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--element-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  &__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: var(--text-lx);
    }
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
    margin-left: 6px;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background-color: var(--border);
    }
  }
}

.modal-body {
  padding: 20px;

  &__form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: var(--text-lx);
    }

    input[type="text"],
    textarea {
      width: 95%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background-color: var(--bg);
      color: var(--text-primary);
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--accent);
      }
    }

    textarea {
      resize: vertical;
      min-height: 60px;
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-right: 10px;

  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid var(--accent);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}

.checkbox-input:checked ~ .checkbox-custom:after {
  display: block;
}

.checkbox-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 28px;
  margin-top: 4px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  &__cancel-btn {
    background: none;
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.1s;

    &:hover {
      opacity: 0.8;
    }
  }

  &__create-btn {
    background-color: var(--accent);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-primary);
    font-weight: 500;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      background-color: var(--border);
      cursor: not-allowed;
    }
  }
}
</style>
