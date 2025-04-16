<template>
  <div class="text-chat">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="{ 'own': msg.author_id === currentUserId }"
      >
        <div class="avatar">
          <img v-if="msg.author_avatar" :src="msg.author_avatar" />
          <div v-else class="avatar-placeholder">
            {{ msg.author_name?.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="bubble">
          <div class="meta">
            <span class="name">{{ msg.author_name }}</span>
            <span class="time">{{ formatTime(msg.created_at) }}</span>
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <div class="input-area">
      <textarea
        v-model="newMessage"
        @keydown.enter.exact.prevent="sendMessage"
        placeholder="Написать сообщение..."
        ref="messageInput"
        rows="1"
      ></textarea>
      <button @click="sendMessage" :disabled="!newMessage.trim()">
        <FeatherIcon name="send" size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const props = defineProps<{
  friendId: string;
}>();

const currentUserId = localStorage.getItem("user_id") || "";
const messages = ref<any[]>([]);
const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

const fetchMessages = async () => {
  // Заглушка: заменить на реальный запрос
  messages.value = []; // Пока пусто
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message = {
    id: Date.now().toString(),
    content: newMessage.value,
    author_id: currentUserId,
    author_name: "Вы",
    author_avatar: "",
    created_at: new Date().toISOString(),
  };

  messages.value.push(message);
  newMessage.value = "";
  scrollToBottom();
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

onMounted(() => {
  fetchMessages();
  scrollToBottom();
  watch(newMessage, () => {
    if (messageInput.value) {
      messageInput.value.style.height = "auto";
      messageInput.value.style.height = `${messageInput.value.scrollHeight}px`;
    }
  });
});
</script>

<style scoped lang="scss">
.text-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 95%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 10px;

  &.own {
    flex-direction: row-reverse;

    .bubble {
      background-color: var(--message-own-bg);
      color: var(--message-own-text);
    }
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--border);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    color: var(--text-primary);
  }
}

.bubble {
  background: var(--message-bg);
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 70%;
}

.meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.input-area {
  display: flex;
  padding: 22px 16px;
  border-top: 1px solid var(--element-bg);
  gap: 10px;
  background: var(--input-bg);
  border-left: 1px solid var(--element-bg);
  border-right: 1px solid var(--element-bg);

  textarea {
    flex: 1;
    resize: none;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    color: var(--text-primary);

    &:focus {
      outline: none;
    }
  }

  button {
    border: none;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;

    &:hover {
      color: var(--text-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
