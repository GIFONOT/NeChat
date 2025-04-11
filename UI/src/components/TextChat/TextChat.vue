<template>
  <div class="text-channel-chat">
    <!-- Заголовок канала -->
    <div class="chat-header">
      <FeatherIcon name="hash" size="20" />
      <h2 class="channel-name">{{ channel?.name }}</h2>
      <div class="channel-description" v-if="channel?.description">
        {{ channel.description }}
      </div>
    </div>

    <!-- Список сообщений -->
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{
          'own-message': message.author.id === currentUser.id,
          'system-message': message.type === 'system',
        }"
      >
        <div class="message-author-avatar">
          <img
            v-if="message.author.avatar"
            :src="message.author.avatar"
            alt="avatar"
          />
          <div v-else class="default-avatar">
            {{ message.author.username.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="author-name">{{ message.author.username }}</span>
            <span class="message-time">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
    </div>

    <!-- Форма отправки сообщения -->
    <div class="message-input-container">
      <div class="input-wrapper">
        <textarea
          v-model="newMessage"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="Написать сообщение..."
          rows="1"
          ref="messageInput"
        ></textarea>
        <button
          class="send-button"
          @click="sendMessage"
          :disabled="!newMessage.trim()"
        >
          <FeatherIcon name="send" size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";


const props = defineProps<{
    channel: TextChannel | null,
    currentUser: User
}>();

const messages = ref<Message[]>([
  {
    id: "1",
    content: "Привет всем! Это тестовое сообщение.",
    author: {
      id: "user1",
      username: "Тестовый Пользователь",
      avatar: "",
    },
    timestamp: new Date(Date.now() - 3600000),
    type: "user",
  },
  {
    id: "2",
    content: "Вы присоединились к каналу",
    author: {
      id: "system",
      username: "Система",
    },
    timestamp: new Date(),
    type: "system",
  },
]);

const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

// Автопрокрутка к новым сообщениям
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Отправка сообщения
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message: Message = {
    id: Date.now().toString(),
    content: newMessage.value,
    author: {
      id: props.currentUser.id,
      username: props.currentUser.username,
      avatar: props.currentUser.image,
    },
    timestamp: new Date(),
    type: "user" as const,
  };

  messages.value.push(message);
  newMessage.value = "";
  scrollToBottom();
};

// Форматирование времени
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Автоматическое увеличение высоты textarea
const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = "auto";
    messageInput.value.style.height = `${messageInput.value.scrollHeight}px`;
  }
};

onMounted(() => {
  scrollToBottom();
  watch(newMessage, adjustTextareaHeight);
});
</script>

<style scoped lang="scss">
.text-channel-chat {
  display: flex;
  flex-direction: column;

  padding-top: 25px;
  //background-color: var(--element-bg);
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid var(--element-bg);
  display: flex;
  align-items: center;
  gap: 10px;

  .channel-name {
    margin: 0;
    font-size: 1.2rem;
  }

  .channel-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;

  &.own-message {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-content {
      background-color: var(--message-own-bg);
      color: var(--message-own-text);
    }
  }

  &.system-message {
    align-self: center;
    justify-content: center;

    .message-content {
      background: none;
      color: var(--text-secondary);
      text-align: center;
    }
  }
}

.message-author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--avatar-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .default-avatar {
    font-weight: bold;
    color: var(--text-primary);
  }
}

.message-content {
  background-color: var(--message-bg);
  padding: 10px 15px;
  border-radius: 8px;
  word-break: break-word;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;

  .author-name {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .message-time {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
}

.message-input-container {
  padding: 15px;
  border-top: 1px solid var(--element-bg);

  .input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background-color: var(--input-bg);
    border-radius: 8px;
    padding: 10px;
  }

  textarea {
    flex: 1;
    border: none;
    background: transparent;
    resize: none;
    max-height: 150px;
    color: var(--text-primary);
    font-family: inherit;

    &:focus {
      outline: none;
    }
  }

  .send-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 5px;

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
