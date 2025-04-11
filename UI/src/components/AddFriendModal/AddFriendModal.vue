<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Добавить друга</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" />
        </button>
      </div>

      <div class="modal-body">
        <label for="username">Логин друга</label>
        <input
          v-model="login"
          type="text"
          id="username"
          placeholder="Введите логин"
        />
        <span v-if="error" class="form-error">{{ error }}</span>
        <span v-if="success" class="form-success">{{ success }}</span>
        <button @click="sendRequest" class="send-btn">Отправить заявку</button>
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
      { receiver_username: login.value,
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--element-bg);
  border-radius: 10px;
  padding: 10px;
  max-width: 400px;
  width: 100%;

  &__header {
    border-bottom: 1px solid var(--border);
    max-height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background-color: var(--bg);
    color: var(--text-primary);
  }

  .send-btn {
    padding: 10px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
}

.form-error {
  color: var(--error);
  font-size: 14px;
}

.form-success {
  color: #4caf50;
  font-size: 14px;
}
</style>