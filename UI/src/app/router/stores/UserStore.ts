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
    // user: {
    //   id: 1,
    //   email: "ame@example.com",
    //   username: userStorage.username,
    //   image: "https://sun9-11.userapi.com/impg/tPC_WVw9-lSqlypnpBxySZm9eloqJBL9di2tSQ/j6onL53z90o.jpg?size=456x492&quality=95&sign=49455024b494d4189109706212579dfe&type=album",
    // } as User,
    mic: true,
  }),

  actions: {
    setUser(newUser: User) {
      this.user = newUser;
      localStorage.setItem("user", JSON.stringify(newUser));
    },
  
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