import { createApp } from "vue";
import { i18n, savedLocale, setLocale } from "./i18n";
import { resolveLocale } from "./i18n/locales";
import App from "./ui/App.vue";
import "./ui/style.css";

await setLocale(resolveLocale(savedLocale(), navigator.languages));
createApp(App).use(i18n).mount("#app");
