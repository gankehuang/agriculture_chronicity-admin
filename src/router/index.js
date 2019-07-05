import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '新闻动态' }
                },
                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '数据中心' }
                },
                {
                    path: '/basetable1',
                    component: resolve => require(['../components/page/BaseTable1.vue'], resolve),
                    meta: { title: '共享联盟' }
                },
                {
                    path: '/basetable2',
                    component: resolve => require(['../components/page/BaseTable2.vue'], resolve),
                    meta: { title: '实验站点' }
                },
                {
                    path: '/basetable4',
                    component: resolve => require(['../components/page/BaseTable4.vue'], resolve),
                    meta: { title: '专家队伍' }
                },
                /*{
                    path: '/networks',
                    component: resolve => require(['../components/page/Networks.vue'], resolve),
                    meta: { title: '工作网络' }
                },
                {
                    path: '/monitoringtask',
                    component: resolve => require(['../components/page/Monitoringtask.vue'], resolve),
                    meta: { title: '监测任务' }
                },*/
                {
                    path: '/aboutus',
                    component: resolve => require(['../components/page/Aboutus.vue'], resolve),
                    meta: { title: '关于我们' }
                },
                {
                    path: '/notificationannouncement',
                    component: resolve => require(['../components/page/Notificationannouncement.vue'], resolve),
                    meta: { title: '通知公告' }
                },

                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
