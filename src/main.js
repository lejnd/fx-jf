import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant';
import 'vant/lib/index.css';

import './assets/reset.css'
import fly from 'flyio';

flyConfig()

fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        if (response.status == 200) {
            return JSON.parse(response.data)
        } else {
            return Promise.reject(response + '错误')
        }
    },
    (err) => {
        //发生网络错误后会走到这里
        if (err.status == 404) {
            return Promise.reject(err)
        } else {
            return Promise.reject(err)
        }
    }
)

Vue.prototype.$fly = fly;
Vue.config.productionTip = false
Vue.use(Vant);

if (sessionStorage.getItem('openid')) {
    initApp()
} else {
    console.log('openid获取成功：', window.$openid);
    sessionStorage.setItem('openid', window.$openid)
    flyConfig();
    initApp();
}

function flyConfig() {
    fly.config = {
        headers: {
            openid: sessionStorage.getItem('openid') || window.$openid,
            'Content-Type': 'x-www-form-urlencoded',
        },
        // baseURL: debug ? '/api' : '',             //请求基地址
        timeout: 0,             //超时时间，为0时则无超时限制
        withCredentials: false    //跨域时是否发送cookie
    }
}

function initApp() {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
}
