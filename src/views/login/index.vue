<template>
    <div class="wrapper">
        <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 400px; padding: 20px; border-radius: 10px">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
            <el-form :model="role" :rules="rules" ref="roleForm">
                <el-form-item prop="userName">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-role" v-model="role.userName"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="role.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input placeholder="请确认密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="role.confirmPassword"></el-input>
                </el-form-item>
<!--                <a href="https://gitee.com/oauth/authorize?client_id=068b619f6c8711924ed0494bbf936cd5c8ed8b87999b2bffa614d9ec15298f68&redirect_uri=http://localhost:9444/auth/oauth2/gitee/success&response_type=code">-->
<!--                  gitee登录-->
<!--                </a>-->
                <el-form-item style="margin: 10px 0; text-align: right">
                    <el-button type="primary" size="small"  autocomplete="off" @click="login">登录</el-button>
                    <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/register')">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import request from "../../utils/request";
    export default {
        name: "Login",
        data() {
            return {
                //绑定的role对象
                role: {},
                confirmPassword:"",

                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            login() {

                this.$refs['roleForm'].validate((valid) => {
                    if (valid) {  // 表单校验合法
                        if (this.role.password !== this.role.confirmPassword) {
                            this.$message.error("两次输入的密码不一致")
                            return false
                        }
                        request.post("/community/estateManager/login", JSON.stringify(this.role)).then(res => {
                            console.log('role:',JSON.stringify(this.role))
                          console.log(res)
                            if(res.code === 20000) {
                                console.log('role:'+JSON.stringify(res.data))

                                localStorage.setItem("role", JSON.stringify(res.data))  // 存储用户信息到浏览器

                                this.$router.push("/")
                                this.$message.success("登录成功")
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                      this.$router.push("/")

                    }
                });
            }
        }
    }
</script>

<style>
    .wrapper {
        height: 100vh;
        /*background-image: url("src/assets/background.jpeg");*/
      background-color: #909399;

      background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
    }
</style>
