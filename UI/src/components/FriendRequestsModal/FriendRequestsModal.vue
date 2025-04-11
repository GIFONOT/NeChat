<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Заявки в друзья</h3>
        <FeatherIcon
              name="x"
              size="16"
              class="cancel-icon"
              @click="closeModal"
            />
      </div>
      <div class="modal-body">
        <div v-if="loading">Загрузка...</div>

        <div v-else>
          <h4>Входящие</h4>
          <div v-if="incoming.length === 0">Нет входящих заявок</div>
          <div v-for="req in incoming" :key="req.id" class="request-card">
            <span>{{ req.sender_name }}</span>
            <div class="actions">
              <button @click="respond(req.sender_name, 'accepted')" class="button-accept">Принять</button>
              <button @click="respond(req.sender_name, 'rejected')" class="button-reject">Отклонить</button>
            </div>
          </div>

          <h4>Исходящие</h4>
          <div v-if="outgoing.length === 0">Нет исходящих заявок</div>
          <div v-for="req in outgoing" :key="req.id" class="request-card">
            <span>{{ req.receiver_name }}</span>
            <div class="status-and-cancel">
              <span class="pending">
                {{ req.status === 'pending' ? 'Ожидает' : req.status === 'rejected' ? 'Отклонено' : req.status }}
              </span>
              <FeatherIcon
                name="x"
                size="16"
                class="cancel-icon"
                @click="cancelRequest(req.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import apiClient from "@/api";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const isOpen = ref(false);
const incoming = ref<any[]>([]);
const outgoing = ref<any[]>([]);
const loading = ref(false);

const emit = defineEmits(["responded"]);

const fetchRequests = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get("/friends/requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    incoming.value = res.data.incoming || [];
    outgoing.value = res.data.outgoing || [];
  } catch (err) {
    console.error("Ошибка при получении заявок:", err);
  } finally {
    loading.value = false;
  }
};

const openModal = async () => {
  isOpen.value = true;
  await fetchRequests();
};

const closeModal = () => {
  isOpen.value = false;
};

const respond = async (sender_name: string, status: string) => {
  try {
    await apiClient.patch("/friends/respond", {
      receiver_username: sender_name,
      status: status,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    emit("responded");
    await openModal(); // обновим список после действия
  } catch (e) {
    console.error("Ошибка при ответе на заявку:", e);
  }
};

const cancelRequest = async (requestId: string) => {
  try {
    await apiClient.delete(`/friends/cancel-request/${requestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await fetchRequests(); // Обновить список после удаления
  } catch (e) {
    console.error("Ошибка при отмене заявки:", e);
  }
};

defineExpose({ openModal });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--element-bg);
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  padding: 10px;
}

.modal-header {
    border-bottom: 1px solid var(--border);
    max-height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body h4 {
  border-bottom: 1px solid var(--border);
  font-size: 24px;
  margin: 12px 0 4px;
}

.request-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
  font-size: 16px;
}

.actions button {
  margin-left: 6px;
}

.pending {
  color: var(--text-secondary);
  font-size: 14px;
}

.button-accept{
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

.button-reject{
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

.cancel-icon {
  margin-left: 8px;
  cursor: pointer;
  color: var(--error);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.status-and-cancel {
  display: flex;
  align-items: center;
  gap: 3px;
}
</style>