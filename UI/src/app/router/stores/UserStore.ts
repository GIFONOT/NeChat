// @/stores/UserStore.ts
import { defineStore } from "pinia";

interface User {
  id: number;
  email: string;
  username: string;
  image: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user") as string) 
      : null as User | null,
    mic: true,
  }),

  actions: {
    updateUsername(username: string) {
      if (this.user) {
        this.user.username = username;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },
  
    updateImage(image: string) {
      if (this.user) {
        this.user.image = image;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    }
  }
});