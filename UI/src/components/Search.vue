<template>
  <div class="search-container" :class="{ focused: isFocused }">
    <FeatherIcon name="search" size="18" class="search-icon" />
    <input
      v-model="searchQuery"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="handleSearch"
    />
    <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
      <FeatherIcon name="x" size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatherIcon from "@/components/Icon/FeatherIcon.vue";

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    debounce?: number;
  }>(),
  {
    placeholder: "Куда летим?",
    debounce: 300,
  }
);

const emit = defineEmits(["search", "update:modelValue"]);

const searchQuery = ref("");
const isFocused = ref(false);

const handleSearch = () => {};

const clearSearch = () => {
  searchQuery.value = "";
  emit("search", "");
  emit("update:modelValue", "");
};
</script>

<style scoped lang="scss">
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  //background-color: var(--element-bg);
  //border-radius: 20px;
  padding: 0 5%;
  border-bottom: 1px solid var(--element-bg);

  &.focused {
    border-color: var(--secondary);
  }
}

.search-icon {
  margin-right: 10px;
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--text-m);
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  margin-left: 6px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: var(--element-bg);
    color: var(--text-primary);
  }
}
</style>
