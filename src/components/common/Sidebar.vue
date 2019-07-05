<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color=""
            text-color="#000" active-text-color="#07C4A8" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title" >{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index" @click="send(subItem.onlyIndex)">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [

                    {
                        icon: 'el-icon-lx-cascades',
                        index: '1',
                        title: '工作网络',
                        subs: [
                            {
                                index: '1-1',
                                title: '监测网络',
                                subs: [
                                    {
                                        index: 'basetable1',
                                        title: '共享联盟',
                                        onlyIndex: '1-1-1'
                                    },
                                    {
                                        index: 'basetable',
                                        title: '数据中心',
                                        onlyIndex: '1-1-2'
                                    },
                                    {
                                        index: 'basetable2',
                                        title: '实验站点',
                                        onlyIndex: '1-1-3'
                                    }
                                ]
                            },
                            {
                                index: 'basetable4',
                                title: '专家队伍',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '2',
                        title: '监测任务',
                        subs: [
                            {
                                index: 'monitoringtask',
                                title: '各中心监测任务',
                            },
                            {
                                index: '2-1',
                                title: '工作资料',
                                subs: [
                                    {
                                        index: 'monitoringtask',
                                        title: '用户手册',
                                    },
                                    {
                                        index: 'monitoringtask',
                                        title: '汇交系统FAQ',
                                    }
                                ]
                            },
                            {
                                index: 'monitoringtask',   
                                title: '应用案例',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-home',
                        index: '3',
                        title: '新闻动态',
                        subs: [
                            {
                                index: 'dashboard',
                                title: '工作动态',
                                onlyIndex: '3-1'
                            },
                            {
                                index: 'dashboard',
                                title: '行业资讯',
                                onlyIndex: '3-2'
                            },
                            {
                                index: 'dashboard',
                                title: '学术资讯',
                                onlyIndex: '3-3'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'Aboutus',
                        title: '关于我们'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'notificationannouncement',
                        title: '通知公告'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

           
        },
        methods: {
            send(ele) {
                bus.$emit('type', ele);
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
