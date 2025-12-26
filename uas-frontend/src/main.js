import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Import router yang kita buat

const app = createApp(App);

app.use(createPinia());
app.use(router); // Gunakan router

app.mount('#app');