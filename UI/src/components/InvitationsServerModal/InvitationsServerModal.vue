<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Пригласить на сервер</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body__form-group">
          <label for="username">Логин пользователя</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите логин пользователя"
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
          class="modal-footer__invite-btn"
          @click="sendInvite"
          :disabled="!username.trim()"
        >
          Отправить приглашение
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import apiClient from "@/api";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);
const username = ref("");
const error = ref("");
const success = ref("");
const inviteCode = ref("");
const loading = ref(false);
const router = useRoute();

const emit = defineEmits(["close", "invite-sent"]);

const openModal = async () => {
  reset();
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  emit("close");
};

const reset = () => {
  username.value = "";
  error.value = "";
  success.value = "";
};

const sendInvite = async () => {
  error.value = "";
  success.value = "";

  if (!username.value.trim()) {
    error.value = "Введите логин пользователя";
    return;
  }

  try {
    await apiClient.post(
      `/servers/${router.params.id}/invites`,
      {
        recipient_username: username.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    success.value = `Приглашение отправлено пользователю ${username.value}!`;
    emit("invite-sent");
    setTimeout(() => closeModal(), 1500);
  } catch (err: any) {
    if (err.response?.data?.detail == "User not found") {
      error.value = "Пользователь не найден";
    } else if (
      err.response?.data?.detail == "The user is already on the server"
    ) {
      error.value = "Пользователь уже на сервере";
    } else if (
      err.response?.data?.detail == "The invitation has already been sent"
    ) {
      error.value = "Приглашение уже отправлено";
    } else {
      error.value = "Ошибка при отправке приглашения";
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

  &__invite-btn {
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
