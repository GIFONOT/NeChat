import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: true,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },

    applyTheme() {
      if (this.isDark) {
        document.body.classList.add("dark");
        document.documentElement.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
        document.documentElement.classList.remove("dark");
      }
    },
    setup() {
      this.applyTheme();
    },
  },
});
