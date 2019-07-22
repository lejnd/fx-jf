import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router =  new Router({
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     component: Home
        // },
        {
            path: '/',
            name: 'jfQuery',
            component: () => import( /* webpackChunkName: "jfQuery" */ './views/jfQuery.vue')
        },
        {
            path: '/info',
            name: 'jfInfo',
            component: () => import( /* webpackChunkName: "jfInfo" */ './views/jfInfo.vue')
        }
    ]
});

export default router;