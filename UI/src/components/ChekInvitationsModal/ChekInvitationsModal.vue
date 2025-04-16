<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>Приглашения на сервер</h3>
        <button class="modal-content__close-btn" @click="closeModal">
          <FeatherIcon name="x" size="20" strokeWidth="2.5" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-state">Загрузка...</div>

        <div v-else class="invites-container">
          <div class="invites-section">
            <h4 class="section-title">Входящие приглашения</h4>
            <div v-if="receivedInvites.length === 0" class="empty-state">
              Нет входящих приглашений
            </div>
            <div
              v-for="invite in receivedInvites"
              :key="invite.id"
              class="invite-card"
            >
              <div class="invite-info">
                <span class="invite-server">{{ invite.servers.name }}</span>
                <span class="invite-sender"
                  >От: {{ invite.sender.username }}</span
                >
              </div>
              <div class="invite-actions">
                <button
                  @click="respondToInvite(invite.id, 'accepted')"
                  class="action-btn action-btn--accept"
                >
                  Принять
                </button>
                <button
                  @click="respondToInvite(invite.id, 'rejected')"
                  class="action-btn action-btn--reject"
                >
                  Отклонить
                </button>
              </div>
            </div>
          </div>

          <div class="invites-section">
            <h4 class="section-title">Отправленные приглашения</h4>
            <div v-if="sentInvites.length === 0" class="empty-state">
              Нет отправленных приглашений
            </div>
            <div
              v-for="invite in sentInvites"
              :key="invite.id"
              class="invite-card"
            >
              <div class="invite-info">
                <span class="invite-server">{{ invite.servers.name }}</span>
                <span class="invite-recipient"
                  >Для: {{ invite.profiles.username }}</span
                >
                <div class="invite-status">
                  <span
                    class="status-badge"
                    :class="{
                      'status-badge--pending': invite.status === 'pending',
                      'status-badge--accepted': invite.status === 'accepted',
                      'status-badge--rejected': invite.status === 'rejected',
                    }"
                  >
                    {{ getStatusText(invite.status) }}
                  </span>
                </div>
              </div>
              <button
                @click="cancelInvite(invite.id)"
                class="cancel-btn"
              >
                <FeatherIcon name="x" size="16" />
              </button>
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
const receivedInvites = ref<any[]>([]);
const sentInvites = ref<any[]>([]);
const loading = ref(false);

const emit = defineEmits(["responded"]);

const fetchInvites = async () => {
  loading.value = true;
  try {
    // Получаем входящие приглашения
    const received = await apiClient.get("servers/invites/received", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // Получаем отправленные приглашения
    const sent = await apiClient.get("servers/invites/sent", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    receivedInvites.value = received.data || [];
    sentInvites.value = sent.data || [];
  } catch (err) {
    console.error("Ошибка при получении приглашений:", err);
  } finally {
    loading.value = false;
  }
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "Ожидает",
    accepted: "Принято",
    rejected: "Отклонено",
  };
  return statusMap[status] || status;
};

const respondToInvite = async (inviteId: string, status: string) => {
  try {
    await apiClient.post(
      `servers/invites/${inviteId}/respond`,
      { status },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    emit("responded");
    await fetchInvites();
  } catch (e) {
    console.error("Ошибка при ответе на приглашение:", e);
  }
};

const cancelInvite = async (inviteId: string) => {
  try {
    await apiClient.delete(`servers/invites/${inviteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await fetchInvites();
  } catch (e) {
    console.error("Ошибка при отмене приглашения:", e);
  }
};

const openModal = async () => {
  isOpen.value = true;
  await fetchInvites();
};

const closeModal = () => {
  isOpen.value = false;
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
  max-width: 500px;
  max-height: 80vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;

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
  overflow-y: auto;
  flex-grow: 1;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 16px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border: 1px dashed var(--border);
  border-radius: 6px;
  margin: 8px 0;
}

.invites-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.invites-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.invite-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: var(--bg);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;

  &:hover {
    border-color: var(--text-primary);
  }
}

.invite-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.invite-server {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.invite-sender,
.invite-recipient {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.invite-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  border: none;
  outline: none;

  &--accept {
    background-color: var(--accent);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &--reject {
    background-color: transparent;
    border: 1px solid var(--error);
    color: var(--error);

    &:hover {
      background-color: var(--error-light);
    }
  }
}

.status-badge {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  display: inline-block;
  margin-top: 4px;

  &--pending {
    color: var(--text-secondary);
  }

  &--accepted {
    color: var(--ok);
  }

  &--rejected {
    color: var(--error);
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
  flex-shrink: 0;
  margin-left: 8px;

  &:hover {
    background-color: var(--error-light);
  }
}
</style>
