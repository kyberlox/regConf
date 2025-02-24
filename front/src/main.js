import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "./assets/styles/main.scss";
import '@vuepic/vue-datepicker/dist/main.css'


import router from './router'

const pinia = createPinia()
const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);

app.use(router)
    .use(pinia)
    .mount('#app')
