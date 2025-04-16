<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Новый сервер</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body__form-group">
          <label for="server-name">название сервера</label>
          <input
            id="server-name"
            v-model="serverName"
            type="text"
            placeholder="Введите название сервера"
          />
        </div>

        <div class="form-group">
          <label>изображение сервера</label>
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
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            />
            <button @click="triggerFileInput" class="form-group__upload-btn">
              {{ previewImage ? "Изменить" : "Выбрать" }}
            </button>
            <span class="form-group__info">max 1MB</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-footer__cancel-btn" @click="closeModal">
          Отмена
        </button>
        <button
          class="modal-footer__create-btn"
          @click="createServer"
          :disabled="!serverName"
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

const emit = defineEmits(["create", "close"]);

const isOpen = ref(false);
const serverName = ref("");
const previewImage = ref("");
const selectedImage = ref<File | null>(null);
const imageUrl = ref("");
const MAX_FILE_SIZE = 1024 * 1024;

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  serverName.value = "";
  previewImage.value = "";
  selectedImage.value = null;
};

const triggerFileInput = () => {
  const fileInput = document.querySelector(".file-input") as HTMLInputElement;
  fileInput.click();
};
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {


    if (input.files[0].size > MAX_FILE_SIZE) {
      alert(
        `Файл слишком большой. Максимальный размер: 1MB`
      );
      input.value = "";
      return;
    }
    selectedImage.value = input.files[0];
    console.log(selectedImage.value);
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// Запрос к серверу
const uploadImage = async () => {
  if (!selectedImage.value) return null;

  const formData = new FormData();
  formData.append("file", selectedImage.value);

  try {
    const response = await apiClient.post("/servers/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data.url);
    imageUrl.value = response.data.url;
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return null;
  }
};

const createServer = async () => {
  try {
    await uploadImage();
    const response = await apiClient.post(
      "/servers/",
      {
        name: serverName.value,
        is_public: true,
        image_url: imageUrl.value || "",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    emit("create", response.data);
    closeModal();
  } catch (error) {
    console.error("Ошибка создания сервера:", error);
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
.file-input {
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
