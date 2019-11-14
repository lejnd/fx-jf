import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugin/fly';
import Vant from 'vant';
import 'vant/lib/index.css';

import './assets/reset.css'

import clipboard from 'clipboard';


Vue.prototype.clipboard = clipboard;
Vue.config.productionTip = false
Vue.use(Vant);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')