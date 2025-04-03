<template>
  <button @click="logout" class="logout-button">
    <FeatherIcon name="log-out" size="22" strokeWidth="2.5" />
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from "@stores/AuthStore";
import { useRouter } from "vue-router";
import FeatherIcon from "@components/Icon/FeatherIcon.vue"
const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/auth/login");
};
</script>

<style scoped>
.logout-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primery);
  transition: all 0.2s;
}

.logout-button:hover {
  color: var(--text-secondary);
}
</style>
