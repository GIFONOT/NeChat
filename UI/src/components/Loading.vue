<template>
  <div class="loading-spinner" v-if="isLoading">
    <FeatherIcon
      name="loader"
      :size="size"
      stroke-width="2.5"
      class="spinner-icon"
    />
  </div>
</template>

<script setup lang="ts">
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  size: {
    type: Number,
    default: 24,
  }
});
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner-icon {
  animation: spin 1.5s linear infinite;
  color: var(--accent);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
