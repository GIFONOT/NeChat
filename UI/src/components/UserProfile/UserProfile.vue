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
            <label for="username">Логин</label>
            <input id="username" v-model="username" type="text" />
            <span v-if="usernameError" class="form-error">{{ usernameError }}</span>
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
            <span v-if="emailError" class="form-error">{{ emailError }}</span>
          </div>
          <button @click="updateEmail">Обновить</button>
        </div>

        <div class="modal-body__form-group with-button">
          <div>
            <label for="password">Новый пароль</label>
            <input id="password" v-model="password" type="password" />
            <span v-if="passwordError" class="form-error">{{ passwordError }}</span>
          </div>
          <button @click="updatePassword">Обновить</button>
        </div>
        <div class="form-group">
          <label>Выбор нового аватара</label>
          <div class="form-group__image-upload">
            <img
              v-if="previewImage"
              :src="previewImage"
              class="form-group__image-preview"
              alt="Preview"
            />
            <div v-else class="form-group__upload-placeholder">
              <FeatherIcon name="image" size="24" />
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input-hidden"
            />
            <button @click="triggerFileInput" class="form-group__upload-btn">
              {{ previewImage ? "Изменить" : "Выбрать" }}
            </button>
            <span class="form-group__info">max 1MB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";
import apiClient from "@/api";
import { useUserStore } from "@stores/UserStore";

const userStore = useUserStore();
const emit = defineEmits(["close"]);
const isOpen = ref(false);
const username = ref("");
const firstName = ref("");
const email = ref("");
const password = ref("");
const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");

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
  usernameError.value = "";
  try {
    await updateField("/profile/update_username", { username: username.value });
    userStore.updateUsername(username.value);
  } catch (error: any) {
    if (error.response?.status === 400 && error.response.data?.detail === "Имя пользователя уже используется") {
      usernameError.value = "Этот логин уже занят";
    } else {
      usernameError.value = "Произошла ошибка при обновлении логина. Попробуйте другой логин";
    }
  }
};
const updateFirstName = () => updateField("/profile/update_first_name", { first_name: firstName.value });
const updateEmail = async () => {
  emailError.value = "";
  try {
    await updateField("/profile/update_email", { email: email.value });
  } catch (error: any) {
    if (error.response?.status === 400) {
      const detail = error.response.data?.detail;
      if (detail === "Этот email уже используется") {
        emailError.value = "Этот email уже используется";
      } else if (detail === "Invalid email format") {
        emailError.value = "Введите корректный email";
      } else {
        emailError.value = "Ошибка при обновлении email";
      }
    }
  }
};
const updatePassword = async () => {
  passwordError.value = "";
  if (password.value.trim().length < 6) {
    passwordError.value = "Пароль должен быть не короче 6 символов";
    return;
  }
  try {
    await updateField("/profile/update_password", { password: password.value });
  } catch (error) {
    passwordError.value = "Ошибка при обновлении пароля";
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
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
      gap: 14px;
      align-items: flex-end;

      > div {
        flex: 1;
      }

      button {
        flex-shrink: 0;
        margin-left: 14px;
        margin-bottom: 3px;
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

.file-input-hidden {
  display: none;
}

.form-group {
  label {
      display: block;
      font-size: var(--text-lx);
    }
  &__image-upload {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 10px;
  }

  &__image-preview {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
  }

  &__upload-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__upload-btn {
    background-color: var(--border);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-primary);

    &:hover {
      opacity: 0.8;
    }
  }
  &__info{
    font-size: 14px;
    color: var(--text-secondary);
  }
}

.form-error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}
</style>
