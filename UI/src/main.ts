import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./app/router/router";
import "@assets/scss/global.scss";
import feather from "feather-icons";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.config.globalProperties.$featherReplace = () => {
  feather.replace();
};
app.mount("#app");
