<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Добавить друга</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body__form-group">
          <label for="username">Логин друга</label>
          <input
            id="username"
            v-model="login"
            type="text"
            placeholder="Введите логин"
          />
          <span v-if="error" class="form-error">{{ error }}</span>
          <span v-if="success" class="form-success">{{ success }}</span>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modal-footer__cancel-btn" @click="closeModal">
          Отмена
        </button>
        <button
          class="modal-footer__send-btn"
          @click="sendRequest"
          :disabled="!login.trim()"
        >
          Отправить заявку
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import apiClient from "@/api";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const isOpen = ref(false);
const login = ref("");
const error = ref("");
const success = ref("");

const emit = defineEmits(["close", "request-sent"]);

const openModal = () => {
  reset();
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  emit("close");
};

const reset = () => {
  login.value = "";
  error.value = "";
  success.value = "";
};

const sendRequest = async () => {
  error.value = "";
  success.value = "";

  if (!login.value.trim()) {
    error.value = "Введите логин";
    return;
  }

  try {
    await apiClient.post(
      "/friends/request",
      { 
        receiver_username: login.value,
        status: "pending",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    success.value = "Заявка отправлена!";
    emit("request-sent");
    setTimeout(() => closeModal(), 1500);
  } catch (e: any) {
    if (e.response?.data?.detail) {
      error.value = e.response.data.detail;
    } else {
      error.value = "Ошибка при отправке заявки";
    }
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
    margin-bottom: 10px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: var(--text-lx);
    }

    input[type="text"] {
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
  }
}

.form-error {
  display: block;
  margin-top: 6px;
  color: var(--error);
  font-size: 14px;
}

.form-success {
  display: block;
  margin-top: 6px;
  color: #4caf50;
  font-size: 14px;
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

  &__send-btn {
    background-color: var(--accent);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: rgb(212, 211, 211);
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      background-color: var(--border);
      color: var(--text-primary);
      cursor: not-allowed;
    }
  }
}
</style>