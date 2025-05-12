// @/stores/UserStore.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user") as string) 
      : null as User | null,
    mic: true,
    sound: true,
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
    },

    updateEmail(email: string) {
      if (this.user) {
        this.user.email = email;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    updateId(id: any) {
      if (this.user) {
        this.user.id = id;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },
    toggleMic() {
      this.mic = !this.mic;
    },
    toggleSound() {
      this.sound = !this.sound;
    },
  }
});