<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Редактировать профиль</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body__form-group with-button">
          <div>
            <label for="username">Имя пользователя</label>
            <input id="username" v-model="username" type="text" />
          </div>
          <button @click="updateUsername">Обновить</button>
        </div>

        <div class="modal-body__form-group with-button">
          <div>
            <label for="firstName">Имя</label>
            <input id="firstName" v-model="firstName" type="text" />
          </div>
          <button @click="updateFirstName">Обновить</button>
        </div>

        <div class="modal-body__form-group with-button">
          <div>
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" />
          </div>
          <button @click="updateEmail">Обновить</button>
        </div>

        <div class="modal-body__form-group with-button">
          <div>
            <label for="password">Новый пароль</label>
            <input id="password" v-model="password" type="password" />
          </div>
          <button @click="updatePassword">Обновить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import apiClient from "@/api";

const emit = defineEmits(["close"]);

const isOpen = ref(false);
const username = ref("");
const firstName = ref("");
const email = ref("");
const password = ref("");

const openModal = (user: any) => {
  username.value = user?.username || "";
  firstName.value = user?.first_name || "";
  email.value = user?.email || "";
  password.value = "";
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  password.value = "";
  emit("close");
};

const updateField = async (url: string, data: object) => {
  try {
     const response = await apiClient.patch(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Ответ сервера:", response.data);
    return response;
  } catch (error) {
    console.error(`Ошибка обновления ${url}:`, error);
    throw error;
  }
};

const updateUsername = async () => {
  try {
    const response = await updateField("/profile/update_username", { username: username.value });
  } catch (error) {
    console.error("Ошибка обновления username:", error);
  }
};
const updateFirstName = () => updateField("/profile/update_first_name", { first_name: firstName.value });
const updateEmail = () => updateField("/profile/update_email", { email: email.value });
const updatePassword = () => {
  if (password.value.trim()) updateField("/profile/update_password", { password: password.value });
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
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
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
    input[type="email"],
    input[type="password"] {
      width: 100%;
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

    &.with-button {
      display: flex;
      gap: 12px;
      align-items: flex-end;

      > div {
        flex: 1;
      }

      button {
        padding: 8px 14px;
        border-radius: 4px;
        border: none;
        background-color: var(--accent);
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
