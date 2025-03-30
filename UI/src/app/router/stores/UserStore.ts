import { defineStore } from "pinia";

export const UserStores = defineStore("user", {
  state: () => ({
    name: "GOYDA",
    mic: true,
  }),
});
