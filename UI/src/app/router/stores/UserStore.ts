import { defineStore } from "pinia";

export const UserStores = defineStore("user", {
  state: () => ({
    name: "Ame",
    mic: true,
    image:
      "https://sun9-11.userapi.com/impg/tPC_WVw9-lSqlypnpBxySZm9eloqJBL9di2tSQ/j6onL53z90o.jpg?size=456x492&quality=95&sign=49455024b494d4189109706212579dfe&type=album",
  }),
});
