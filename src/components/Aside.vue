<!--导航菜单-->
<template>
    <!--router 模式：转至子项路由-->
    <el-menu :default-openeds="['1', '2','3','4','5']" style="min-height: 100%; overflow-x: hidden"
             background-color="rgb(48, 65, 86)"
             text-color="#fff"
             active-text-color="#ffd04b"
             :collapse-transition="false"
             :collapse="isCollapse"
             router
    >
        <div style="height: 60px; line-height: 60px; text-align: center">
<!--            <img src="../assets/logo.png" alt="" style="width: 20px; position: relative; top: 5px; right: 5px">-->
<!--            <b style="color: white" v-show="logoTextShow">物业管理系统</b>-->
        </div>

        <el-submenu index="1">

            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>小区管理</span>
            </template>
            <el-menu-item index="/community/table">
                <span slot="title">小区列表</span>
            </el-menu-item>
        </el-submenu>

        <el-submenu index="2" >
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">业主信息管理</span>
            </template>

                <el-menu-item index="/owner/info">
                    <i class="el-icon-s-custom"></i>
                    <span slot="title">人员管理</span>
                </el-menu-item>
        </el-submenu>


      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">停车位管理</span>
        </template>

        <el-menu-item index="/parking/info">
          <i class="el-icon-s-custom"></i>
          <span slot="title">车位管理</span>
        </el-menu-item>

      </el-submenu>

      <el-submenu index="4" >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">服务管理</span>
        </template>

        <el-menu-item index="/property/activity">
          <i class="el-icon-s-custom"></i>
          <span slot="title">活动管理</span>
        </el-menu-item>
        <el-menu-item index="/property/complaint">
          <i class="el-icon-s-custom"></i>
          <span slot="title">投诉管理</span>
        </el-menu-item>

        <el-menu-item index="/property/chat">
          <i class="el-icon-s-custom"></i>
          <span slot="title">在线对话</span>
        </el-menu-item>
      </el-submenu>

<!--      <el-submenu index="5" >-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-menu"></i>-->
<!--          <span slot="title">用户管理</span>-->
<!--        </template>-->

<!--        <el-menu-item index="/owner/role">-->
<!--          <i class="el-icon-s-custom"></i>-->
<!--          <span slot="title">注册用户管理</span>-->
<!--        </el-menu-item>-->

<!--      </el-submenu>-->





    </el-menu>
</template>

<script>
    export default {
        name: "Aside",
        data(){
            return{
                user_role: localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : {},

            }
        },
        // created() {
        //     console.log('user_role',this.user_role.isAdmin)
        // },
        props: {
            isCollapse: Boolean,
            logoTextShow: Boolean
        }
    }
</script>

<style scoped>

</style>
