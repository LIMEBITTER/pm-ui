<template>
    <div style="font-size: 12px;  line-height: 60px; display: flex">
        <div style="flex: 1; font-size: 20px">
            <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>

            <!-- 动态页签 -->
<!--            <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">-->
<!--                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
<!--                <el-breadcrumb-item :to="user">用户管理</el-breadcrumb-item>-->
<!--            </el-breadcrumb>-->
            <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
                <el-breadcrumb-item v-for="(name,index) in matchedArr" :key="index">
                    {{ name}}
                </el-breadcrumb-item>

            </el-breadcrumb>


        </div>
        <el-dropdown style="width: 100px; cursor: pointer">
            <div style="display: inline-block">
<!--                <img :src="user.avatarUrl" alt=""-->
<!--                     style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">-->
                <span>{{ user.userName }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
<!--                <el-dropdown-item style="font-size: 14px; padding: 5px 0">-->
<!--                    <router-link to="/person">个人信息</router-link>-->
<!--                </el-dropdown-item>-->
                <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                    <span style="text-decoration: none" @click="logout">退出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

</template>

<script>
    export default {
        name: "Header",
        props:{
            collapseBtnClass:String,
        },


        //面包屑导航
        computed:{
            matchedArr(){
                let temp = [],temps = [];
                this.$route.matched.filter((item,index,self) => {
                    // if(item.meta.title){
                    //     const title = item.meta.title;
                    //     temp.push(title);
                    // }
                    if(item.name){
                        const name = item.meta.title;
                        temp.push(name);
                    }
                });
                temp.filter((item,index,self) => {
                    if(!temps.includes(item)){
                        temps.push(item);
                    }
                })
                return temps;
            }
        },
        data(){
            return {
                user: localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : {},

            }
        },

        methods: {
            collapse() {
                // this.$parent.$parent.$parent.$parent.collapse()  // 通过4个 $parent 找到父组件，从而调用其折叠方法
                this.$emit("asideCollapse")
            },
            logout() {

                this.$router.push("/login")
                localStorage.removeItem("role")
                this.$message.success("退出成功")
            }
        },

    }
</script>

<style scoped>

</style>
