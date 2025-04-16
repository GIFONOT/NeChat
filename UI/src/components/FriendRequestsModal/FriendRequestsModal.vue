<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Заявки в друзья</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-state">Загрузка...</div>

        <div v-else class="requests-container">
          <div class="requests-section">
            <h4 class="section-title">Входящие</h4>
            <div v-if="incoming.length === 0" class="empty-state">Нет входящих заявок</div>
            <div v-for="req in incoming" :key="req.id" class="request-card">
              <span class="request-username">{{ req.sender_name }}</span>
              <div class="request-actions">
                <button @click="respond(req.sender_name, 'accepted')" class="action-btn action-btn--accept">
                  Принять
                </button>
                <button @click="respond(req.sender_name, 'rejected')" class="action-btn action-btn--reject">
                  Отклонить
                </button>
              </div>
            </div>
          </div>

          <div class="requests-section">
            <h4 class="section-title">Исходящие</h4>
            <div v-if="outgoing.length === 0" class="empty-state">Нет исходящих заявок</div>
            <div v-for="req in outgoing" :key="req.id" class="request-card">
              <span class="request-username">{{ req.receiver_name }}</span>
              <div class="request-status">
                <span class="status-badge" :class="{
                  'status-badge--pending': req.status === 'pending',
                  'status-badge--rejected': req.status === 'rejected'
                }">
                  {{ req.status === 'pending' ? 'Ожидает' : req.status === 'rejected' ? 'Отклонено' : req.status }}
                </span>
                <button @click="cancelRequest(req.id)" class="cancel-btn">
                  <FeatherIcon name="x" size="16" />
                </button>
              </div>
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
    await fetchRequests();
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
    await fetchRequests();
  } catch (e) {
    console.error("Ошибка при отмене заявки:", e);
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
  max-height: 60vh;
  overflow-y: auto;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
}

.requests-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.requests-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: var(--text-l);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.empty-state {
  color: var(--text-secondary);
  font-size: var(--text-m);
  text-align: center;
  padding: 8px 0;
}

.request-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  transition: all 0.2s;

  &:hover {
    border-color: var(--text-primary);
  }
}

.request-username {
  font-size: var(--text-m);
  color: var(--text-primary);
}

.request-actions {
  display: flex;
  gap: 8px;
}

.request-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &--accept {
    background-color: var(--accent);
    border: none;
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &--reject {
    background: none;
    border: 1px solid var(--error);
    color: var(--error);

    &:hover {
      background-color: var(--error-light);
    }
  }
}

.status-badge {
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;

  &--pending {
    color: var(--text-secondary);
  }

  &--rejected {
    color: var(--error);
    background-color: var(--error-light);
  }
}

.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--error);
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: var(--error-light);
  }
}
</style>