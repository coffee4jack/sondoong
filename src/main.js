import { createApp } from "vue";
import "@fontsource/pt-sans/400.css";
import "@fontsource/pt-sans/700.css";
import "./index.css";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
