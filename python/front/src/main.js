import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "./assets/styles/main.scss";

import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
    .use(pinia)
    .mount('#app')
